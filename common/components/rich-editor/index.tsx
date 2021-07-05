import React, { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { message, List, Avatar } from 'antd'
import { PictureOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { Upload } from '@common/components'
import { useService, useLocalStorage } from '@common/hooks'
import BraftEditor from 'braft-editor'
import Preview from './preview'
import { ContentUtils } from 'braft-utils'
import { Modifier, EditorState } from 'draft-js'
import { upload, getFileKeyAndUrl } from '@common/utils'
import { COS_URL } from '@common/constants/cos'
import { cosServices, userServices } from '@common/services'
import { IUser } from '@common/types'
import type { UploadProps } from 'antd/lib/upload'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { BraftEditorProps, MediaType, EditorState as IEditorState } from 'braft-editor'
import type { FC, ReactNode } from 'react'
import 'braft-editor/dist/index.css'

interface MentionUser {
  id: number
  nickname: string
  avatar?: string
}

export async function getMentionList(stateOrHtml: IEditorState | string): Promise<MentionUser[]> {
  const html: string = typeof stateOrHtml === 'string' ? stateOrHtml : await stateOrHtml.toHTML()
  const mentions: string[] = html.match(/<a href=["']\/.+#mention["']>@\S+\s?<\/a>/g) || []
  return mentions.map((user) => {
    const [, id, nickname] = user.match(/<a href=["']\/user\/(.+)#mention["']>@(\S+)\s?<\/a>/)
    return { id: Number(id), nickname }
  })
}

interface RichEditorProps extends Omit<BraftEditorProps, 'onChange'> {
  bordered?: boolean
  value?: IEditorState
  onChange?: (value: IEditorState) => void
}

const RichEditor: FC<RichEditorProps> = memo((props) => {
  const { bordered = true, value, onChange, ...otherProps } = props
  // 标记是否进入@状态
  const [mentionFlag, setMentionFlag] = useState<boolean>(false)
  // 进入@状态后保存一些位置信息及即将被选择的员工所在员工选择器的index
  const [mentionState, setMentionState] = useState<{ left: number; top: number; index: number }>()
  // 员工列表
  const [searchUserName, setSearchUserName] = useState<string>('')
  // Upload fileList为[]
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // 本地缓存的曾提及用户
  const [usedMentions, setUsedMentions] = useLocalStorage<MentionUser[]>(
    '__MENTIONED_USER_LIST__',
    [],
  )

  const { i18n } = useTranslation()

  const updateLocalStoreMentions = useCallback<(userInfo: MentionUser) => void>(
    (userInfo) => {
      const uniqueMentionList = usedMentions.filter((usedMention) => usedMention.id !== userInfo.id)
      setUsedMentions([userInfo, ...uniqueMentionList.slice(0, 3)])
    },
    [usedMentions, setUsedMentions],
  )

  const getUserListParams = useMemo<IUser['getListParams']>(
    () => ({
      page: 1,
      size: 5,
      search: searchUserName,
    }),
    [searchUserName],
  )

  const [loadingUser, userRes, userErr] = useService(
    userServices.getList,
    getUserListParams,
    !searchUserName,
  )
  const userList = useMemo<MentionUser[]>(() => {
    if (!searchUserName) return usedMentions
    if (userErr) {
      message.error(userErr.message || '获取列表失败')
      return []
    }
    return userRes?.data?.list?.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
    }))
  }, [searchUserName, userRes, userErr, usedMentions])

  const cancelMention = useCallback<() => void>(() => {
    setMentionFlag(false)
    setMentionState(undefined)
  }, [])

  const selectMentioningUser = useCallback<(index: number) => void>(
    (index) => {
      const currentSelectionState = value.getSelection()
      const end = currentSelectionState.getAnchorOffset()
      const anchorKey = currentSelectionState.getAnchorKey()
      const currentContent = value.getCurrentContent()
      const currentBlock = currentContent.getBlockForKey(anchorKey)
      const blockText = currentBlock.getText()
      const start = blockText.slice(0, end).lastIndexOf('@')
      const userInfo = userList[index]
      if (!userInfo) return
      const contentStateWithEntity = currentContent.createEntity('LINK', 'IMMUTABLE', {
        href: `/user/${userInfo.id}#mention`,
      })
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const mentionTextSelection = currentSelectionState.merge({
        anchorOffset: start,
        focusOffset: end,
      })
      const insertingContent = Modifier.replaceText(
        value.getCurrentContent(),
        mentionTextSelection,
        `@${userInfo.nickname} `,
        null,
        entityKey,
      )
      const newEditorState = EditorState.push(value, insertingContent, 'insert-fragment')
      if (onChange)
        onChange(EditorState.forceSelection(newEditorState, insertingContent.getSelectionAfter()))
      updateLocalStoreMentions(userInfo)
      cancelMention()
    },
    [value, userList, onChange, cancelMention, updateLocalStoreMentions],
  )

  const richTextChange = useCallback<(editState: IEditorState) => void>(
    async (editState) => {
      if (onChange) onChange(editState)
      const selection = window.getSelection()
      if (!selection?.rangeCount) return
      const range = selection.getRangeAt(selection.rangeCount - 1)
      const text = range.startContainer.textContent.slice(0, range.startOffset)
      const index = text.lastIndexOf('@')
      if (index === -1) return
      if (text.slice(index) === '@') {
        setMentionFlag(true)
        if (!usedMentions.length) return
      }
      const mentionText = text.slice(index + 1)
      if (mentionText.includes(' ')) {
        cancelMention()
        setSearchUserName('')
        return
      }
      if (mentionText) setSearchUserName(mentionText)
      const tempRange = range.cloneRange()
      tempRange.setStart(tempRange.startContainer, index)
      const rangeRect = tempRange.getBoundingClientRect()
      setMentionState({ left: rangeRect.left, top: rangeRect.bottom, index: 0 })
    },
    [usedMentions, cancelMention, onChange],
  )

  const handleKeyCommand = useCallback<(command: string) => 'handled' | 'not-handled'>(
    (command) => {
      // 按下回车键
      if (mentionFlag && command === 'split-block') {
        if (mentionState?.index === undefined || mentionState?.index < 0) {
          cancelMention()
        } else {
          selectMentioningUser(mentionState.index)
        }
        return 'handled'
      }
      return 'not-handled'
    },
    [mentionFlag, mentionState, cancelMention, selectMentioningUser],
  )

  const handleArrowChange = useCallback<(event: KeyboardEvent) => void>(
    (event) => {
      if (!mentionFlag || !mentionState) return
      const { code } = event
      event.preventDefault()
      setMentionState((prevValue) =>
        code === 'ArrowDown'
          ? { ...prevValue, index: prevValue.index === userList.length ? 0 : prevValue.index + 1 }
          : {
              ...prevValue,
              index: prevValue.index === -1 ? userList.length - 1 : prevValue.index - 1,
            },
      )
    },
    [userList, mentionFlag, mentionState],
  )

  const uploadHandler = useCallback<UploadProps['onChange']>(
    ({ file, fileList }) => {
      const { url, status } = file
      if (status !== 'done') {
        setFileList(fileList)
      } else {
        setFileList([])
        if (onChange) onChange(ContentUtils.insertMedias(value, [{ type: 'IMAGE', url }]))
      }
    },
    [value, onChange],
  )

  const myUploadFn = useCallback<MediaType['uploadFn']>(async (param) => {
    const { file, progress, success, error } = param
    const [key, url] = getFileKeyAndUrl(file)
    const cosUploadSignature = await cosServices.getCosSignature()
    upload({
      method: 'POST',
      action: COS_URL,
      file: param.file as UploadRequestOption['file'],
      data: {
        key,
        Signature: cosUploadSignature,
        success_action_status: '200',
      },
      onError: (error as unknown) as UploadRequestOption['onError'],
      onProgress: (event) => progress(event.percent),
      onSuccess: () => {
        success({
          url,
          meta: {
            id: (param as any).id || uuid(),
            title: 'image',
            alt: 'image',
            loop: false, // 指定音视频是否循环播放
            autoPlay: false, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            poster: `${__SERVER_ORIGIN__}/public/assets/images/default/poster.jpeg`, // 指定视频播放器的封面
          },
        })
      },
    })
  }, [])

  const handlePreview = useCallback<() => void>(() => {
    if ((window as any).previewWindow) (window as any).previewWindow.close()
    ;(window as any).previewWindow = window.open()
    ;(window as any).previewWindow.document.write(`
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
            .container a[href$='#mention'] {
              text-decoration: none;
              font-weight: bold;
              color: #58f;
            }
          </style>
        </head>
        <body>
          <div class="container">${value.toHTML()}</div>
        </body>
      </html>
    `)
    ;(window as any).previewWindow.document.close()
  }, [value])

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (event.code === 'Escape') cancelMention()
    }
    window.addEventListener('keydown', keydownListener)
    window.addEventListener('scroll', cancelMention)
    window.addEventListener('resize', cancelMention)
    return () => {
      window.removeEventListener('keydown', keydownListener)
      window.removeEventListener('scroll', cancelMention)
      window.removeEventListener('resize', cancelMention)
    }
  }, [cancelMention])

  const userSelectorComponent = useMemo<ReactNode>(() => {
    if (!mentionFlag || !mentionState) return null
    return (
      <List
        size="small"
        split={false}
        loading={loadingUser}
        itemLayout="horizontal"
        dataSource={userList}
        style={{
          width: 200,
          cursor: 'pointer',
          backgroundColor: '#f5f5f6',
          border: '1px solid rgba(0,0,0,0.02)',
          position: 'fixed',
          left: mentionState.left,
          top: mentionState.top,
          zIndex: 10001,
        }}
        renderItem={(item, index) => (
          <List.Item
            style={{
              padding: 5,
              backgroundColor: mentionState.index === index ? '#e6f7ff' : undefined,
            }}
            onClick={() => {
              selectMentioningUser(index)
            }}
            onMouseEnter={() => {
              setMentionState((prevValue) => ({ ...prevValue, index }))
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={`${__SERVER_ORIGIN__}/public/assets/images/default/avatar.jpeg`}
                />
              }
              title={<div style={{ marginLeft: -10, paddingTop: 2 }}>{item.nickname}</div>}
            />
          </List.Item>
        )}
      />
    )
  }, [mentionFlag, mentionState, loadingUser, userList, selectMentioningUser])

  return (
    <div style={bordered ? { border: '1px solid lightgray' } : {}}>
      <BraftEditor
        value={value}
        language={i18n.language === 'zh-CN' ? 'zh' : 'en'}
        contentStyle={{ height: 200 }}
        controls={[
          'font-size',
          'line-height',
          'letter-spacing',
          'headings',
          'text-color',
          'bold',
          'italic',
          'underline',
          'strike-through',
          'superscript',
          'subscript',
          'text-indent',
          'text-align',
          'list-ul',
          'list-ol',
          'blockquote',
          'code',
          'link',
          'hr',
          'emoji',
          'fullscreen',
          'table',
          'media',
        ]}
        extendControls={[
          {
            key: 'upload-preview',
            type: 'component',
            component: (
              <>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  fileList={fileList}
                  onChange={uploadHandler}
                >
                  <button type="button" className="control-item button">
                    <PictureOutlined />
                  </button>
                </Upload>
                {/* 分开写会换行 */}
                <button type="button" className="control-item button" onClick={handlePreview}>
                  <EyeOutlined />
                </button>
              </>
            ),
          },
        ]}
        onChange={richTextChange}
        onBlur={() => setTimeout(cancelMention, 500)}
        media={{ uploadFn: myUploadFn }}
        draftProps={{
          handleKeyCommand,
          onUpArrow: handleArrowChange,
          onDownArrow: handleArrowChange,
        }}
        {...otherProps}
      />
      {userSelectorComponent}
    </div>
  )
})

const RichEditorForExport = Object.assign(RichEditor, {
  Preview,
  getMentionList,
})

export default RichEditorForExport

// import React, { PureComponent } from 'react'
// import { Upload, Button, Modal, message } from 'antd'
// import 'cropperjs/dist/cropper.css'
// import Cropper from 'react-cropper'
// import styles from './Upload.less'

// class CropperUpload extends PureComponent {
//   constructor(props) {
//     super(props)
//     this.state = {
//       width: props.width,
//       height: props.height,
//       pattern: props.pattern,
//       fileList: props.fileList ? props.fileList : [],
//       editImageModalVisible: false,
//       srcCropper: '',
//       selectImgName: '',
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     if ('fileList' in nextProps) {
//       this.setState({
//         fileList: nextProps.fileList ? nextProps.fileList : [],
//       })
//     }
//   }

//   handleCancel = () => {
//     this.setState({
//       editImageModalVisible: false,
//     })
//   }

//   // 图片Upload上传之前函数
//   beforeUpload(file, fileList) {
//     const isLt10M = file.size / 1024 / 1024 < 10
//     if (!isLt10M) {
//       //添加文件限制
//       MsgBox.error({ content: '文件大小不能超过10M' })
//       return false
//     }
//     var reader = new FileReader()
//     const image = new Image()
//     var height
//     var width
//     //因为读取文件需要时间,所以要在回调函数中使用读取的结果
//     reader.readAsDataURL(file) //开始读取文件
//     reader.onload = (e) => {
//       image.src = reader.result
//       image.onload = () => {
//         height = image.naturalHeight
//         width = image.naturalWidth
//         if (height < this.state.height || width < this.state.width) {
//           message.error('图片尺寸不对 宽应大于:' + this.state.width + '高应大于:' + this.state.height)
//           this.setState({
//             editImageModalVisible: false, //打开控制裁剪弹窗的变量，为true即弹窗
//           })
//         } else {
//           this.setState({
//             srcCropper: e.target.result, //cropper的图片路径
//             selectImgName: file.name, //文件名称
//             selectImgSize: file.size / 1024 / 1024, //文件大小
//             selectImgSuffix: file.type.split('/')[1], //文件类型
//             editImageModalVisible: true, //打开控制裁剪弹窗的变量，为true即弹窗
//           })
//           if (this.refs.cropper) {
//             this.refs.cropper.replace(e.target.result)
//           }
//         }
//       }
//     }
//     return false
//   }

//   handleRemove(file) {
//     this.setState((state) => {
//       const index = state.fileList.indexOf(file)
//       const newFileList = state.fileList.slice()
//       newFileList.splice(index, 1)
//       this.props.onChange(newFileList)
//       return {
//         fileList: newFileList,
//       }
//     })
//   }

//   //将base64码转化成blob格式
//   convertBase64UrlToBlob(base64Data) {
//     var byteString
//     if (base64Data.split(',')[0].indexOf('base64') >= 0) {
//       byteString = atob(base64Data.split(',')[1])
//     } else {
//       byteString = unescape(base64Data.split(',')[1])
//     }
//     var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
//     var ia = new Uint8Array(byteString.length)
//     for (var i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i)
//     }
//     return new Blob([ia], { type: this.state.selectImgSuffix })
//   }

//   //将base64码转化为FILE格式
//   dataURLtoFile(dataurl, filename) {
//     var arr = dataurl.split(','),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n)
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n)
//     }
//     return new File([u8arr], filename, { type: mime })
//   }

//   _ready() {
//     this.refs.cropper.setData({
//       width: this.state.width,
//       height: this.state.height,
//     })
//   }

//   saveImg() {
//     const { dispatch } = this.props
//     var formdata = new FormData()
//     formdata.append('files', this.dataURLtoFile(this.refs.cropper.getCroppedCanvas().toDataURL(), this.state.selectImgName))
//     dispatch({
//       type: 'getData/postimage',
//       payload: formdata,
//       callback: () => {
//         const { success, msg, obj } = this.props.imagePictures
//         if (success) {
//           let imageArry = this.state.pattern == 3 ? this.state.fileList.slice() : []
//           imageArry.push({
//             uid: Math.random() * 100000,
//             name: this.state.selectImgName,
//             status: 'done',
//             url: obj[0].sourcePath,
//             // url:obj[0].sourcePath,
//             thumbUrl: this.refs.cropper.getCroppedCanvas().toDataURL(),
//             thumbnailPath: obj[0].thumbnailPath,
//             largePath: obj[0].largePath,
//             mediumPath: obj[0].mediumPath,
//             upload: true,
//           })
//           this.setState({
//             fileList: imageArry,
//             editImageModalVisible: false, //打开控制裁剪弹窗的变量，为true即弹窗
//           })
//           this.props.onChange(imageArry)
//         } else {
//           message.error(msg)
//         }
//       },
//     })
//   }

//   render() {
//     const botton =
//       this.state.pattern == 2 ? (
//         <div>
//           <Icon type="plus" />
//           <div className="ant-upload-text">Upload</div>
//         </div>
//       ) : (
//         <Button>
//           <Icon type="upload" />
//           选择上传
//         </Button>
//       )

//     return (
//       <div>
//         <Upload
//           name="files"
//           action="/hyapi/resource/image/multisize/upload"
//           listType={this.state.pattern === 1 ? ' ' : this.state.pattern === 2 ? 'picture-card' : 'picture'}
//           className={this.state.pattern === 3 ? styles.uploadinline : ''}
//           beforeUpload={this.beforeUpload.bind(this)}
//           onRemove={this.handleRemove.bind(this)}
//           fileList={this.state.fileList}
//         >
//           {botton}
//         </Upload>
//         <Modal
//           key="cropper_img_icon_key"
//           visible={this.state.editImageModalVisible}
//           width="100%"
//           footer={[
//             <Button type="primary" onClick={this.saveImg.bind(this)}>
//               保存
//             </Button>,
//             <Button onClick={this.handleCancel.bind(this)}>取消</Button>,
//           ]}
//         >
//           <Cropper
//             src={this.state.srcCropper} //图片路径，即是base64的值，在Upload上传的时候获取到的
//             ref="cropper"
//             preview=".uploadCrop"
//             viewMode={1} //定义cropper的视图模式
//             zoomable={true} //是否允许放大图像
//             movable={true}
//             guides={true} //显示在裁剪框上方的虚线
//             background={false} //是否显示背景的马赛克
//             rotatable={false} //是否旋转
//             style={{ height: '100%', width: '100%' }}
//             cropBoxResizable={false}
//             cropBoxMovable={true}
//             dragMode="move"
//             center={true}
//             ready={this._ready.bind(this)}
//           />
//         </Modal>
//       </div>
//     )
//   }
// }
// export default CropperUpload

// <CropperUpload
//      pattern={1}//模式分为三种，1为只能上传一张图片，2为上传多张图片
//      width={375}
//      height={120}
//      onChange={this.ChangeIconImage.bind(this)}
//      fileList={this.state.iconUrl}
//    />

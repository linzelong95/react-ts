import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './User'
import { Article } from './Article'

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  reply: string

  @Column({ default: 0 })
  isApproved: number

  @Column({ default: 0 })
  isTop: number

  @Column({ default: 0 })
  parentId: number

  @CreateDateColumn()
  createDate: string

  @ManyToOne(() => User, (user) => user.froms)
  @JoinColumn({ name: 'fromId' })
  from: User

  @ManyToOne(() => User, (user) => user.tos)
  @JoinColumn({ name: 'toId' })
  to: User

  @ManyToOne(() => Article, (article) => article.replies, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  article: Article
}

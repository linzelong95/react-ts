import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { Category } from './Category'
import { User } from './User'
import { Content } from './Content'
import { Tag } from './Tag'
import { Reply } from './Reply'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  abstract: string

  @Column()
  imageUrl: string

  @Column({ default: 1 })
  isEnable: number

  @CreateDateColumn()
  createDate: string

  @UpdateDateColumn()
  updateDate: string

  @Column({ default: 0 })
  isTop: number

  @OneToOne(() => Content, (content) => content.article, { cascade: true })
  content: Content

  @ManyToOne(() => Category, (category) => category.articles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  category: Category

  @ManyToOne(() => User, (user) => user.articles)
  user: User

  @ManyToMany(() => Tag, (tag) => tag.articles)
  tags: Tag[]

  @OneToMany(() => Reply, (reply) => reply.article)
  replies: Reply[]
}

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { Article } from './Article'

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  content: string

  @OneToOne(() => Article, (article) => article.content, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  article: Article
}

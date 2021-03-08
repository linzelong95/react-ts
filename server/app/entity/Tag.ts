import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import { Sort } from './Sort'
import { Article } from './Article'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ default: 1 })
  isEnable: number

  @Column({ default: 0 })
  isUsed: number

  @CreateDateColumn()
  createDate: string

  @UpdateDateColumn()
  updateDate: string

  @ManyToOne(() => Sort, (sort) => sort.tags, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sort: Sort

  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable()
  articles: Article[]
}

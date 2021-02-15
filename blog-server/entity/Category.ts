import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { Sort } from './Sort'
import { Article } from './Article'

@Entity()
export class Category {
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

  @ManyToOne(() => Sort, (sort) => sort.categories, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sort: Sort

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}

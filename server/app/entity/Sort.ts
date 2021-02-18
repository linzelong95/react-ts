import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Category } from './Category'
import { Tag } from './Tag'

@Entity()
export class Sort {
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

  @OneToMany(() => Category, (category) => category.sort)
  categories: Category[]

  @OneToMany(() => Tag, (tag) => tag.sort)
  tags: Tag[]
}

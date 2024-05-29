
import {
  Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  export abstract class BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;
  
      @CreateDateColumn({
        type: 'timestamp',
      })
      createdAt: Date;
  
      @UpdateDateColumn({
        type: 'timestamp',
      })
      updatedAt: Date;
      
      @DeleteDateColumn({
        type: 'timestamp',
      })
      deletedAt: Date;

      @Column({ default: false })
      isDeleted: boolean;
  }
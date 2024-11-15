import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
@Unique(['pair', 'source', 'timestamp'])
@Entity()
export class PriceHistory {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  pair: string;

  @Column('float')
  @Field(() => Float)
  price: number;

  @Column({ type: 'timestamptz' })
  @Field(() => Date)
  timestamp: Date;

  @Column()
  @Field(() => String)
  source: string;
}

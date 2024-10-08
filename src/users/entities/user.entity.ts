import { CreditCardEntity } from 'src/credit-card/entities/credit-card.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { ThirdPartyEntity } from 'src/third-party/entities/third-party.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';


@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column({ nullable: true })
  user_password?: string;

  @Column()
  user_profile: number;

  @CreateDateColumn({ name: 'user_created_date' })
  userCreatedDate: Date;

  @UpdateDateColumn({ name: 'user_update_date' })
  userUpdateDate: Date;

  @Column({ nullable: true })
  user_refresh_token: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.users)
  @JoinColumn({ name: 'user_profile' })
  profile: ProfileEntity;

  @OneToMany(() => CreditCardEntity, (creditCard) => creditCard.user)
  creditCards: CreditCardEntity[];

  @OneToMany(() => ThirdPartyEntity, (thirdParty) => thirdParty.user)
  thirdParties: ThirdPartyEntity[];
}

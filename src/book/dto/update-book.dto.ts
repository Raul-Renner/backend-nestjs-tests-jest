/* eslint-disable prettier/prettier */
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from "../schemas/book.schema"
import { User } from "../../auth/schemas/user.schema"

export class BookUpdateDto {

    @IsOptional()
    @IsString()
    readonly id: string

    @IsOptional()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsString()
    readonly author: string

    @IsOptional()
    @IsNumber()
    readonly price: number

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please, enter correctly category' })
    readonly category: Category

    @IsEmpty({ message: "You cannot pass user Id"})
    readonly user: User;
}
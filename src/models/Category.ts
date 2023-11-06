

export interface IRespGame{
    id_game : string,
    name_game :string
}

export interface IrespListCategoryGame{
    id_category:String,
    name_category :string,
    game:IRespGame[]
}

export interface IAddCategory {
    name:string
}



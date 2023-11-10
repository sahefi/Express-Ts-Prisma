export interface IassignedJabatan{
    role_id : string;
    id : string
}

export interface IreqAssignJabatan{
    assigned:IassignedJabatan
}

export interface IlistJabatan{
    page : Number
    per_page : Number
    name_role: string 
    name_jabatan :string
}


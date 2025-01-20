export interface PostData {
    _id:string,
    body:string,
    image?:string,
    user:User,
    createdAt:string,
    comments:Comment[]
}
interface User {
    _id:string,
    name:string,
    photo:string
}
interface Comment {
    _id:string,
    content:string,
    commentCreator:User,
    createdAt:string,
    post:string
}
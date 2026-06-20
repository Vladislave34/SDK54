export default interface ITokenDecode {
    email: string,
    name: string,
    image: string,
    roles: string[],
    exp: number
}
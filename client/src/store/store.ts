import axios from "axios";
import { makeAutoObservable } from "mobx";
import { api_url } from "../http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponse";
import AuthService from "../services/AuthService";



export default class Store {
    user = {} as IUser
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser) {
        this.user = user
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)            
        } catch (error) {
            console.log(error)
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)            
        } catch (error) {
            console.log(error)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (error) {
            console.log(error)
        }
    }

    async checkAuth() {
        try {
            this.setLoading(true)
            const response = await axios.get<AuthResponse>(`${api_url}/refresh`, {withCredentials: true})
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error)
        } finally {
            this.setLoading(false)
        }
    }
    
}
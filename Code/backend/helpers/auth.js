import bcrypt from "bcrypt"

export default class HashAndVerify {
    hashPassword(password){
        return new Promise((resolve,reject)=>{
            bcrypt.genSalt(12,(err,salt)=>{
                if(err){
                    reject(err)
                }
                bcrypt.hash(password,salt,(err,hash)=>{
                    if(err){
                        reject(arr)
                    }
                    resolve(hash)
                })
            })
        })
    }
}

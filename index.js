//Dependencies
const Simple_AES_246 = require("simple-aes-256")
const Dir_Archiver = require("./utils/dir-archiver.js")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Functions
function Encrypt(text = String, use_key = String){
    let encryptedText = ""

    let key = 0;
    let use_key_length = use_key.length + 72728532

    for( let i = 0; i <= use_key_length; i++){
        key += use_key.length ** use_key.length + 72728532
    }
    
    for( let i = 0; i < text.length; i++){
        let char = text.charCodeAt(i)
        let encryptedChar = char + use_key.charCodeAt(i % use_key.length)

        encryptedText += String.fromCharCode(encryptedChar)
    }

    return encryptedText
}

//Main
if(!Self_Args.length){
    console.log("node index.js <password> <directory/encrypted_file_path> <output_name> <encrypt/decrypt>")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid directory/encrypted_file_path.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid output_name.")
    process.exit()
}

if(!Self_Args[3]){
    console.log("Invalid encrypt/decrypt option.")
}

switch(Self_Args[3]){
    case "encrypt":
        if(!Fs.existsSync(Self_Args[1])){
            console.log("Invalid directory/encrypted_file_path.")
            break
        }

        console.log("Encrypting the directory, please wait(This might take a while).")
        let archive = new Dir_Archiver(Self_Args[1], `${Self_Args[2]}.zip`, [])
        archive.createZip()
        
        setTimeout(function(){
            let archived_file_data = Fs.readFileSync(`${Self_Args[2]}.zip`)
            let encrypted_data = Simple_AES_246.encrypt(Encrypt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaBcDeFgHiJkLmNoPqRsTuVwXyZaBCDEFGHIJKLMNOPQRSTUVWXYZ", Self_Args[0]), archived_file_data)

            Fs.writeFileSync(`${Self_Args[2]}.encvc`, encrypted_data)
            Fs.unlinkSync(`${Self_Args[2]}.zip`)
            console.log(`Directory successfully encrypted and save to ${Self_Args[2]}.encvc`)
        }, 2000)
        break
    case "decrypt":
        if(!Fs.existsSync(`${Self_Args[1]}.encvc`)){
            console.log("Invalid directory/encrypted_file_path.")
            break
        }

        console.log("Decrypting the encrypted directory, please wait(This might take a while).")
        let encrypted_file_data = Fs.readFileSync(`${Self_Args[1]}.encvc`)
        let decrypted_data = Simple_AES_246.decrypt(Encrypt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaBcDeFgHiJkLmNoPqRsTuVwXyZaBCDEFGHIJKLMNOPQRSTUVWXYZ", Self_Args[0]), encrypted_file_data)
        
        Fs.writeFileSync(`${Self_Args[2]}.zip`, decrypted_data)
        console.log(`Encrypted directory successfully decrypted and save to ${Self_Args[2]}.zip`)
        break
    default:
        console.log("Invalid encrypt/decrypt option.")
        break
}

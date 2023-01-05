const generateUserID=(userID,prefix)=>{
    let id=parseInt(userID.substring(4))+1;
    id.toString();
    while(prefix.length+id.toString().length<10){
        prefix+="0";
    }
    prefix+=id;
    return prefix;
}

const generateOtp=()=>{
    let otp=Math.random()*10000001;
    return parseInt(otp);
}

module.exports={
    generateUserID,
    generateOtp
};
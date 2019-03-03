module.exports = (fields,files)=>{
    const {name,price} = fields; 
    if(files.photo.size && name!=='undefined' && price!=='undefined'){
        return true;
    }else{
        return false;
    }
};
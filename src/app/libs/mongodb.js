// import mongoose from "mongoose";

// export default async function connectMongoDB() {
//     if(mongoose.connection.readyState !== 0) {
//         try{
//             await mongoose.connect(process.env.MONGODB_URI);
//             console.log("MongoDB connected");
//         }catch(error){
//             console.log(error);
//             throw error
//         }
//     }else{
//         console.log("MongoDB already connected");
//     }
// }
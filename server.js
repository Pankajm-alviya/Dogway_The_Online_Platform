import express from 'express';
import cookieParser  from 'cookie-parser'
import adminRoutes from './routes/adminRoutes.js';
import dealerRoutes from './routes/dealerRoutes.js';
import customerRoutes from './routes/customerRoutes.js'; 
import serviceRoutes from './routes/serviceProviderRoutes.js'; 
import connectDB from "./db/connectdb.js";


const DATABASES_URL = "mongodb://127.0.0.1:27017";
connectDB(DATABASES_URL);
// Set the view engine and specify the views folder
const app = express();
app.set('view engine', 'ejs');
app.set('views','views');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'));
app.use(express.static('public'));
app.use(express.static('css'));
app.use(cookieParser());

app.use('/', customerRoutes); 
app.use('/admin', adminRoutes);
app.use('/dealer',dealerRoutes);
app.use('/serviceProvider',serviceRoutes);

// Start the server
app.listen(4006, () => {
  console.log('Server is running on port http://localhost:4006');
});

import express from 'express';
import adminController from "../controller/adminController.js";
import authUserController from "../controller/authUserController.js";
import upload from '../middleware/upload.js';

const router = express.Router();
router.use(express.static('public'));

router.get('/',authUserController.authenticateAdmin,adminController.adminViewOrderController);
router.get('/adminResetPassword', (req, res) => {
  res.render('admin/adminResetPassword');
});
router.get("/adminProvideTimecustomer/:customerEmail_id", (req, res) => {
  var customerEmail_id = req.params.customerEmail_id;
  console.log("jhgiyuk 0",customerEmail_id)
  res.render('admin/providetimeDogMating', { customerEmail_id: customerEmail_id });
})
router.post("/adminLogin",adminController.adminLoginController);
router.get("/adminDashboard",adminController.adminViewOrderController);
router.get("/servesDogList",adminController.adminViewServiesDog)
router.get('/matingDog',adminController.adminViewMatingDog)
router.get('/adminViewCustomer', adminController.viewCustomer);
router.get('/adminAddCategory', adminController.viewCategory);
router.post('/addCategory', adminController.addCategory);
router.get("/deleteCategory/:category",adminController.deleteCategory);
router.get("/editCategory/:category",adminController.editCategory);
router.post("/upCategory/:category",adminController.updateCategory);
router.get("/deactivateUser/:CEmail",adminController.deleteCustomer);
router.get('/adminViewServiceProvider',adminController.viewServiceProvider);
router.get("/deactivateService/:email",adminController.deleteServiceProvider);
router.get('/adminViewProduct',upload, adminController.viewProduct);
router.post("/delete/:id",adminController.deleteDocById);
router.get('/adminMessage',adminController.viewMessage);
router.get("/adminLogout",adminController.adminLogoutController);
router.post("/EmailMassageSend",adminController.EmailMassageSendCustomerController);
router.get("/adminVieowServiesProvider/:customerEmail", adminController.adminViewServiesProvider);
router.get("/provideTimeAndDate/:customer_email/:serviceProvider_id",adminController.provideTimeAndDate);
router.post("/EmailMassageSendCustomerForserves",adminController.EmailMassageSendCustomerForserves);
router.get("/adminProvideTime/:customerEmail_id", (req, res) => {
  var customerEmail_id = req.params.customerEmail_id;
  res.render('admin/provideTimeForCustomer', { customerEmail_id: customerEmail_id });

})
router.get("/breedInfoForm", (req, res) => {
  res.render("admin/breedInfoForm");
});
router.get("/forgetPasswordFrom",adminController.forgetPasspwrdFrom);
router.post("/adminfrogetpassword",adminController.matchDataAdminEmailController);
router.post("/confirm-passwordAdmin",adminController.confirmPassword);
router.post("/adminsetfrogetpassword",adminController.adminsetfrogetpasswordcontroller);
router.post('/sendMessage:email',adminController.sendMessage);

export default router;
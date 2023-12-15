import express from 'express';
import { DogController, MatingController} from '../controller/dealerController.js';
import upload from '../middleware/upload.js';
import authUserController from '../controller/authUserController.js';
const router = express.Router();
router.use(express.static('public'));
router.get('/DealerFaq', (req, res) => {
  res.render('dealer/DealerFaq');

});
router.post('/addSellingDog',upload,DogController.addSellingDog);
router.post('/addDogForMating',upload,MatingController.addDogForMating);
router.get("/edit/:id",DogController.editDoc);
router.post("/update/:id",upload,DogController.updateDocById);
router.post("/delete/:id",DogController.deleteDocById);
router.get('/dealarMatingpage',upload,MatingController.dogMating);
router.post('/deletematingdog/:id',MatingController.deleteDocById);
router.get('/fetchMatingaDogData/:id',MatingController.fetchMatingaDogData);
router.post('/updateDogForMating/:id',upload,MatingController.updateDogForMating);
router.get('/dealerProfile',(req,res)=>{
   res.render("dealer/profile");
});

router.get("/authCustomer:roll", authUserController.authenticateUser,authUserController.authorizeUser);
router.get('/', upload, DogController.dogadd);

export default router;
const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, getDoctors, getDoctorById, getNearbyDoctors, getDoctorProfile, updateDoctorProfile, updateDoctorLocation, addDoctorReview, getDoctorReviews, getAllReviews, deleteDoctorProfile, likeReview } = require('../controllers/doctorController');
const { protect, doctor } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// router.post('/signup', upload.single('profilePhoto'), registerDoctor);
router.post(
    '/signup',
    (req, res, next) => {
        console.log("🔥 SIGNUP ROUTE HIT");
        next();
    },
    upload.single('profilePhoto'),
    (req, res, next) => {
        console.log("🔥 MULTER PASSED");
        console.log("FILE:", req.file);
        next();
    },
    registerDoctor
);
router.post('/signin', loginDoctor);
router.get('/', getDoctors);
router.get('/nearby', getNearbyDoctors); // Must be before /:id
router.get('/reviews/all', getAllReviews); // Global reviews for landing page
// Doctor Profile Routes
router.route('/me')
    .get(protect, doctor, getDoctorProfile)
    .put(protect, doctor, upload.single('profilePhoto'), updateDoctorProfile)
    .delete(protect, doctor, deleteDoctorProfile);
router.put('/update-location', protect, doctor, updateDoctorLocation);
// Public single-doctor fetch (must be above /:id/reviews)
router.get('/:id', getDoctorById);
// Patient Reviews Route
router.route('/:id/reviews')
    .post(protect, addDoctorReview)
    .get(getDoctorReviews);
// Like/Unlike Review Route
router.route('/reviews/:id/like')
    .put(protect, likeReview);
module.exports = router;


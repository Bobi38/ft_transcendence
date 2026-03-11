import { bcrypt, jwt, express, secret} from './index.js';

const router = express.Router();
// /api/fetchStatMorp/5
// /fetchStatMorp/:page
// const page1 = parseInt(req.params.page) || 1;
// console.log("API get_morpion_stat(1) params ", page1);
// /api/fetchStatMorp?page=${page_nb}


router.get('/serv', async (req, res) => {

        console.log("API gameservetest(1) called");
        return res.status(201).json({success: true});

        // const page1 = parseInt(req.params.page) || 1;
        // console.log("API get_morpion_stat(1) params ", page1);
        // const page2 = parseInt(req.query.page) || 1;
        // console.log("API get_morpion_stat(1) query ", page2);

})

export default router;
import express from 'express';
import Client from '../../models/client-account.js';
import Provider from '../../models/provider-account.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/get/user-details/:id', async(req, res) => {
    try{
      const id = req.params.id;
      if(id){
        const client = await Client.findOne({where: {id}});
        const provider = await Provider.findOne({where: {id}});
        if(client){
          const fullname = client.firstname + " " + client.lastname;
          return res.status(200).json({fullname, profile_pic: client.profile_pic});
        }
  
        if(provider){
          const fullname = provider.firstname + " " + provider.lastname;
          return res.status(200).json({fullname, profile_pic: provider.profile_pic});
        }
      }else{
        throw new Error('User not found'); 
      }
  
    }catch(err){
      res.status(400).json({error: err});
      console.log(err);
    }
  
  })
  
router.get('/api/user', async (req, res) => {
    const token = req.cookies.jwt;
      if (token) {
          try {
              const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
              const id = decodedToken.id;
              
              if(id) {
                const client = await Client.findOne({where: {id}});
                const provider = await Provider.findOne({where: {id}});
  
                if(client) return res.status(200).json({ user: 'Client'});
                if(provider) return res.status(200).json({ user: 'Provider'});
              }
          } catch (err) {
              return res.json({ error: 'Invalid Token' });
          }
      } else {
          return res.json({ error: 'No token found' });
      }
  });
  
router.get('/api/getToken', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'No token found' });
    }
    res.status(200).json({ token });
});

export default router;
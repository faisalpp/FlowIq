
const {SHOPIFY,BASE_URL} = require('../config');
const {upsertShopAuth} = require('../apis/auth/index');
const DB = require('../db');
const Fetch = require('node-fetch');

async function RedirectToShopifyAuth(req, res) {
    // console.log('RedirectToShopifyAuth called with query:', req.query);
    const shop = req.query.shop;
    if(!shop){
        return res.status(400).send('Missing shop parameter');
    }

    const rows = await DB`SELECT * FROM flow_iq_auth WHERE shop = ${shop} LIMIT 1`

    const isAuth = rows[0] || false
    console.log('isAuth:', isAuth);
    if (isAuth) {
     return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting…</title>
          <meta name="shopify-api-key" content="${SHOPIFY.API_KEY}" />
          <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
          <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
        </head>
        <style>
         .rotate {
           display: inline-block;   
           animation: spin 2s linear infinite;
           height:fit-content;
           width: 20%
         }
         @keyframes spin {
           from {
             transform: rotate(0deg);
           }
           to {
             transform: rotate(360deg);
           }
         }
        </style>
        <body>
          <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh" >
           <svg class="rotate;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM272 528C272 501.5 293.5 480 320 480C346.5 480 368 501.5 368 528C368 554.5 346.5 576 320 576C293.5 576 272 554.5 272 528zM112 272C138.5 272 160 293.5 160 320C160 346.5 138.5 368 112 368C85.5 368 64 346.5 64 320C64 293.5 85.5 272 112 272zM480 320C480 293.5 501.5 272 528 272C554.5 272 576 293.5 576 320C576 346.5 554.5 368 528 368C501.5 368 480 346.5 480 320zM139 433.1C157.8 414.3 188.1 414.3 206.9 433.1C225.7 451.9 225.7 482.2 206.9 501C188.1 519.8 157.8 519.8 139 501C120.2 482.2 120.2 451.9 139 433.1zM139 139C157.8 120.2 188.1 120.2 206.9 139C225.7 157.8 225.7 188.1 206.9 206.9C188.1 225.7 157.8 225.7 139 206.9C120.2 188.1 120.2 157.8 139 139zM501 433.1C519.8 451.9 519.8 482.2 501 501C482.2 519.8 451.9 519.8 433.1 501C414.3 482.2 414.3 451.9 433.1 433.1C451.9 414.3 482.2 414.3 501 433.1z"/></svg>
          </div>
          <script>
            const AppBridge = window['app-bridge'];
              const app = AppBridge.default({
                apiKey: "${SHOPIFY.API_KEY}",
                host: shopify.config.host,
                forceRedirect: true
              });
              const Redirect = AppBridge.actions.Redirect;
              Redirect.create(app).dispatch(Redirect.Action.APP, "/dashboard");
          </script>
        </body>
      </html>
    `);
    }

    const installUrl = `https://${shop}/admin/oauth/authorize?` + new URLSearchParams({
        client_id: SHOPIFY.API_KEY,
        scope: SHOPIFY.SCOPES ?? '',
        redirect_uri: SHOPIFY.SHOPIFY_CALLBACK_URL,
    }).toString();

    // return res.redirect(installUrl);
    return res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Redirecting…</title>
      <meta name="shopify-api-key" content="${SHOPIFY.API_KEY}" />
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
      <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
    </head>
     <style>
      .rotate {
        display: flex;         /* for images or divs */
        animation: spin 2s linear infinite; /* 2s per rotation, infinite loop */
        height:fit-content;
        width: 20%;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
     </style>
    <body>
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh" >
       <svg class="rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM272 528C272 501.5 293.5 480 320 480C346.5 480 368 501.5 368 528C368 554.5 346.5 576 320 576C293.5 576 272 554.5 272 528zM112 272C138.5 272 160 293.5 160 320C160 346.5 138.5 368 112 368C85.5 368 64 346.5 64 320C64 293.5 85.5 272 112 272zM480 320C480 293.5 501.5 272 528 272C554.5 272 576 293.5 576 320C576 346.5 554.5 368 528 368C501.5 368 480 346.5 480 320zM139 433.1C157.8 414.3 188.1 414.3 206.9 433.1C225.7 451.9 225.7 482.2 206.9 501C188.1 519.8 157.8 519.8 139 501C120.2 482.2 120.2 451.9 139 433.1zM139 139C157.8 120.2 188.1 120.2 206.9 139C225.7 157.8 225.7 188.1 206.9 206.9C188.1 225.7 157.8 225.7 139 206.9C120.2 188.1 120.2 157.8 139 139zM501 433.1C519.8 451.9 519.8 482.2 501 501C482.2 519.8 451.9 519.8 433.1 501C414.3 482.2 414.3 451.9 433.1 433.1C451.9 414.3 482.2 414.3 501 433.1z"/></svg>
      </div>
      <script>
        const AppBridge = window['app-bridge'];
          const app = AppBridge.default({
            apiKey: "${SHOPIFY.API_KEY}",
            host: shopify.config.host,
            forceRedirect: true
          });
          const Redirect = AppBridge.actions.Redirect;
          Redirect.create(app).dispatch(Redirect.Action.REMOTE, "${installUrl}");
      </script>
    </body>
  </html>
`);


}


async function HandleCallback(req,res){  
  // console.log('HandleCallback called with query:', req.query);
        const shop = req.query.shop;
        const code = req.query.code;
        const apiKey = SHOPIFY.API_KEY;
        const apiSecret = SHOPIFY.API_SECRET;

        if(!shop || !code){
            return res.status(400).send('Missing required parameters1');
        }

        // Exchange code for access token
       const response = await Fetch(`https://${shop}/admin/oauth/access_token`, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
           client_id: apiKey,
           client_secret: apiSecret,
           code: code
         })
       });

       // Before parsing JSON, check content type
       const contentType = response.headers.get('content-type');
       if (!contentType || !contentType.includes('application/json')) {
         return res.redirect('/dashboard/unauthorized');
       }
       
       const accessData = await response.json();
       if(accessData.access_token){
          // Save access token
          await upsertShopAuth(shop,accessData.access_token)
          // Register webhooks
          await RegisterOrdersWebhook(shop,accessData.access_token);
          // redirect to dashboard
          return res.redirect('/dashboard?shop='+shop);
          
        }else{
         return res.redirect('/dashboard/unauthorized');
        }        
        
    }


 async function RegisterOrdersWebhook(shop,token){
      
     const webhooks = [
         {
             'topic' : 'app/uninstalled',
             'address' : BASE_URL+'/api/uninstall',
             'format' : 'json'
         }
     ];

     webhooks.forEach(async (webhook) => {
         const payload = {webhook: webhook};
     
         const response = await fetch(`https://${shop}/admin/api/2023-04/webhooks.json`, {
             method: 'POST',
             headers: {
                 'X-Shopify-Access-Token': token,
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(payload)
         });
     
         if (!response.ok) {
             const responseBody = await response.text();
             console.error('Webhook registration failed', {
                 topic: webhook.topic,
                 status: response.status,
                 body: responseBody
             });
         }
     });
        
    }
    
  async function AppUninstall(req,res){
     
     const data = req.body;
     
     try{
      await DB`DELETE FROM flow_iq_auth WHERE shop = ${data.myshopify_domain}`;
      return res.status(200).send('App Uninstalled successfully!');
     }catch(e){
      return res.status(500).send('Something went wrong!');
     }   
    }


module.exports = {  
    RedirectToShopifyAuth,
    HandleCallback,
    AppUninstall
};    
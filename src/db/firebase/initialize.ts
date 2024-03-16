// firebase don't support destructured imports in the Admin SDK.

import * as firebaseAdmin from 'firebase-admin'
import { FirebaseType } from '../types/firebase.type';
require('dotenv').config()

function privateKeyFormatter(key: string) {
    return key.replace(/\\n/g, '\n')
}

export const createFirebaseAdmin = (params: FirebaseType) => {
    const privateKey = privateKeyFormatter(params.private_key)
   
    if(firebaseAdmin.apps.length > 0) {
        return firebaseAdmin.app()
    }

    const cert = firebaseAdmin.credential.cert({
        projectId: params.project_id,
        clientEmail: params.client_email,
        privateKey
    })

    return firebaseAdmin.initializeApp({
        credential: cert, 
        projectId: params.project_id,
        storageBucket: params.storage_bucket
    })
}


export async function initAdmin() {
    const params = {
        project_id: process.env.FIREBASE_PROJECT_ID as string,
        client_email: process.env.FIREBASE_CLIENT_EMAIL as string ,
        storage_bucket: process.env.FIREBASE_STORAGE_BUCKET as string,
        private_key: process.env.FIREBASE_PRIVATE_KEY as string,
    }

    return createFirebaseAdmin(params)
}

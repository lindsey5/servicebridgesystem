// Routes
import clientAuthRoutes from './client/clientAuthRoutes.js';
import clientRoutes from './client/clientRoutes.js';
import providerAuthRoutes from './provider/providerAuthRoutes.js';
import providerRoutes from './provider/providerRoutes.js';
import servicesOfferedRoutes from './service/servicesOfferedRoutes.js';
import servicesRoutes from './service/servicesRoutes.js';
import transactionRoutes from './transaction/transactionRoutes.js';
import availableDateRoutes from './available_date/availableDateRoutes.js';
import earningRoutes from './earning/earningRoutes.js';
import categoryRoutes from './category/categoryRoutes.js';
import paymentRoutes from './payment/paymentRoutes.js';
import providerBalanceRoutes from './provider/providerBalanceRoutes.js';
import userRoutes from './user/userRoutes.js';

const useRoutes = (app) => {
    app.use(clientAuthRoutes);
    app.use('/api/client', clientRoutes);
    app.use(providerAuthRoutes);
    app.use('/api/provider', providerRoutes);
    app.use('/api/services-offered', servicesOfferedRoutes);
    app.use('/api/services', servicesRoutes);
    app.use('/api',transactionRoutes);
    app.use('/api',availableDateRoutes);
    app.use('/api/earning', earningRoutes);
    app.use('/api/', categoryRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/provider/balance', providerBalanceRoutes);
    app.use(userRoutes);
}

export default { useRoutes };
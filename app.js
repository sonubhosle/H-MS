const express = require('express');
const app  = express();
const cors = require('cors');

 app.use(express.json());
 app.use(cors());

const Auth_Route = require('./Routes/UserRoutes')
app.use('/api/hms', Auth_Route);

const DoctorRoute = require('./Routes/DoctorRoutes')
app.use("/api/hms", DoctorRoute);

const AppointmentRoutes = require("./Routes/AppointmentRoutes");
app.use("/api/hms", AppointmentRoutes);

const AdminRoutes = require('./Routes/AdminRoutes');
app.use('/api/hms/admin', AdminRoutes);

const PaymentRoutes = require('./Routes/PaymentRoutes');
app.use('/api/hms', PaymentRoutes);

 module.exports = app;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const doctor_route_1 = require("../modules/doctor/doctor.route");
const patient_route_1 = require("../modules/patient/patient.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/doctors',
        route: doctor_route_1.DoctorRoutes,
    },
    {
        path: '/patients',
        route: patient_route_1.PatientRoutes,
    },
    {
        path: '/dashboard',
        route: dashboard_route_1.DashboardRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

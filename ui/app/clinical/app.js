'use strict';

angular.module('consultation', ['ngSanitize', 'ui.router', 'bahmni.clinical', 'bahmni.common.patient', 'bahmni.common.uiHelper', 'bahmni.common.patientSearch',
    'bahmni.common.domain', 'bahmni.common.conceptSet', 'authentication', 'bahmni.common.appFramework', 'bahmni.adt',
    'httpErrorInterceptor', 'pasvaz.bindonce', 'opd.patientDashboard', 'infinite-scroll', 'bahmni.common.util', 'ngAnimate','ngDialog','angular-gestures']);
angular.module('consultation').config(['$stateProvider', '$httpProvider', '$urlRouterProvider', function ($stateProvider, $httpProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/patient/search');
        $stateProvider
            .state('patientsearch', {
                url: '/patient/search',
                views: {
                    'content': { 
                        templateUrl: '../common/patient-search/views/patientsList.html',
                        controller : 'PatientsListController'
                    }
                },
                data: {
                    backLinks: [{label: "Home", url: "../home/"}]
                },
                resolve: {
                    initialization: 'initialization'
                }
            })
            .state('patient', {
                url: '/patient/:patientUuid',
                abstract: true,
                data: {
                    backLinks: [{label: "Patients", state: "patientsearch"}]
                },

                views: {
                    'additional-header': { template: '<div ui-view="additional-header"></div>' },
                    'content': { template: '<div ui-view="content"></div><patient-control-panel/>' }
                },
                resolve: {
                    consultationInitialization: function(consultationInitialization, $stateParams) {
                    return consultationInitialization($stateParams.patientUuid);
                }}
            })
            .state('patient.dashboard', {
                url: '/dashboard',
                views: {
                    'additional-header': { templateUrl: 'views/dashboardHeader.html' },
                    'content': {
                        templateUrl: 'views/dashboard.html',
                        controller: 'PatientDashboardController'
                    }
                },
                resolve: {
                    "diseaseTemplates": function(diseaseTemplatesInitialization,$stateParams){
                        return diseaseTemplatesInitialization($stateParams.patientUuid);
                    }
                }
            })
            .state('patient.visit', {
                url: '/dashboard/visit/:visitUuid',
                data: {
                    backLinks: [{label: "Dashboard", state: "patient.dashboard"}]
                },
                views: {
                    'additional-header': { templateUrl: 'views/dashboardHeader.html' },
                    'content': {
                        templateUrl: 'views/visit.html',
                        controller: 'VisitController'
                    }
                },
                resolve: {
                    visitInitialization: function(visitInitialization, $stateParams) {
                    return visitInitialization($stateParams.patientUuid, $stateParams.visitUuid);
                }}
            })
            .state('patient.consultation', {
                url: '',
                abstract: true,
                data: {
                    backLinks: [{label: "Dashboard", state: "patient.dashboard"}]
                },
                views: {
                    'content': { template: '<ui-view/>' },
                    'additional-header': { templateUrl: 'views/includes/header.html' }
                }
            })
            .state('patient.consultation.visit', {
                url: '/visit/:visitUuid',
                templateUrl: 'views/visit.html',
                controller: 'VisitController',
                resolve: {
                    visitInitialization: function(visitInitialization, $stateParams) {
                    return visitInitialization($stateParams.patientUuid, $stateParams.visitUuid);
                }}
            })
            .state('patient.consultation.summary', {
                url: '/consultation',
                templateUrl: 'views/consultation.html',
                controller: 'ConsultationController'
            })
            .state('patient.consultation.investigation', {
                url: '/investigation',
                templateUrl: 'views/investigations.html',
                controller: 'InvestigationController'
            })
            .state('patient.consultation.diagnosis', {
                url: '/diagnosis',
                templateUrl: 'views/diagnosis.html',
                controller: 'DiagnosisController'
            })
            .state('patient.consultation.treatment', {
                abstract: true,
                templateUrl: 'views/treatment.html',
                resolve: {
                    treatmentConfig: 'treatmentConfig',
                    prescribedDrugOrders: function(TreatmentService, $stateParams) {
                        return TreatmentService.getPrescribedDrugOrders($stateParams.patientUuid, true, 5).then(function(result){
                            return result;
                        });
                    }
                }
            })
            .state('patient.consultation.treatment.page', {
                url: '/treatment',
                views: {
                    "addTreatment": {
                        controller: 'TreatmentController',
                        templateUrl: 'views/addTreatment.html'
                    },
                    "viewHistory": {
                        controller: 'DrugOrderHistoryController',
                        templateUrl: 'views/treatmentSections/drugOrderHistory.html'
                    }
                }
            })
            .state('patient.consultation.disposition', {
                url: '/disposition',
                templateUrl: 'views/disposition.html',
                controller: 'DispositionController'
            })
            .state('patient.consultation.conceptSet', {
                url: '/concept-set-group/:conceptSetGroupName',
                templateUrl: 'views/conceptSet.html',
                controller: 'ConceptSetPageController'
            })
            .state('patient.consultation.notes', {
                url: '/notes',
                templateUrl: 'views/notes.html'
            })
            .state('patient.consultation.templates', {
                url: '/templates',
                templateUrl: 'views/comingSoon.html'
            })
            .state('patient.consultation.new', {
                url: '/new',
                templateUrl: 'views/patientDashboard.html'
            })
            .state('visitsummaryprint', {
                url: '/latest-visit-summary-print/patient/:patientId',
                views :{
                    'content' : {
                        controller: 'LatestVisitSummaryPrintController'
                    }
                }
            });
        $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
    }]).run(['$rootScope', '$state', '$window', function ($rootScope, $state, $window) {

            FastClick.attach(document.body);

//        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//            if (!$state.is('patientsearch')) return;
//            event.preventDefault();
//            $window.location.reload();
//        })
    }]);

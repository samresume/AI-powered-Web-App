from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import ProjectsViewSet, ProjectsInfoViewSet, UserInfoViewSet, UserViewSet, DatasetViewSet, ProjectResultViewSet,\
        MessageViewSet, FeedbackViewSet, BugReportViewSet, AugmentedDatasetViewSet, FNDatasetViewSet, AugmentationResultViewSet

router = routers.DefaultRouter()
router.register('project', ProjectsViewSet)
router.register('dataset', DatasetViewSet)
router.register('fn-dataset', FNDatasetViewSet)
router.register('augmented-dataset', AugmentedDatasetViewSet)
router.register('user-info', UserInfoViewSet)
router.register('project-info', ProjectsInfoViewSet)
router.register('project-result', ProjectResultViewSet)
router.register('augmented-result', AugmentationResultViewSet)
router.register('bug-report', BugReportViewSet)
router.register('feedback', FeedbackViewSet)
router.register('message', MessageViewSet)
router.register('user', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

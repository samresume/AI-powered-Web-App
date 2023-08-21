from django.contrib import admin
from .models import UserInfo, ProjectInfo, Project, ProjectResult, Dataset, File, Message, BugReport, BugFile,\
    Feedback, FNDataset, AugmentedDataset, AugmentationResult

@admin.register(Project)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'status']
    list_filter = ['status', 'datetime']
    search_fields = ['project_name']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'urgent']
    list_filter = ['type', 'urgent']
    search_fields = ['title']

@admin.register(BugReport)
class BugReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'urgent']
    list_filter = ['title', 'urgent']
    search_fields = ['title']

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['title', 'score']
    list_filter = ['title', 'score']
    search_fields = ['title']

@admin.register(BugFile)
class BugFileAdmin(admin.ModelAdmin):
    list_display = ['data']
    list_filter = ['data']
    search_fields = ['data']

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ['dataset_name', 'data_type']
    list_filter = ['data_type', 'datetime']
    search_fields = ['data_type']

@admin.register(FNDataset)
class FNDatasetAdmin(admin.ModelAdmin):
    list_display = ['dataset_name', 'status']
    list_filter = ['status', 'datetime']
    search_fields = ['status']

@admin.register(AugmentedDataset)
class AugmentedDatasetAdmin(admin.ModelAdmin):
    list_display = ['dataset_name', 'status']
    list_filter = ['status', 'datetime']
    search_fields = ['status']

@admin.register(File)
class FileDatasetAdmin(admin.ModelAdmin):
    list_display = ['name', 'data']
    list_filter = ['name', 'data']
    search_fields = ['name']

@admin.register(ProjectInfo)
class ProjectsInfoAdmin(admin.ModelAdmin):
    list_display = ['task', 'learning_type', 'ml_model']
    list_filter = ['task', 'learning_type', 'ml_model']
    search_fields = ['ml_model', 'task']

@admin.register(ProjectResult)
class ProjectResultAdmin(admin.ModelAdmin):
    list_display = ['accuracy']
    list_filter = ['accuracy']

@admin.register(AugmentationResult)
class AugmentationResultAdmin(admin.ModelAdmin):
    list_display = ['accuracy']
    list_filter = ['accuracy']


@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'country']
    list_filter = ['type', 'country']
    search_fields = ['name', 'email']


# admin.site.register(UserInfo)
# admin.site.register(ProjectsInfo)
# admin.site.register(Projects)
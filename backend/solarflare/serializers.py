from rest_framework import serializers
from .models import Project, ProjectInfo, UserInfo, ProjectResult, Dataset, File, Message, BugFile, BugReport,\
    Feedback, FNDataset, AugmentedDataset, AugmentationResult
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = '__all__'


class BugFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = BugFile
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = ('id', 'title', 'description', 'score', 'datetime')


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ('id', 'title', 'description', 'type', 'urgent', 'datetime')


class BugReportSerializer(serializers.ModelSerializer):

    data = BugFileSerializer(many=False)

    class Meta:
        model = BugReport
        fields = ('id', 'title', 'description',
                  'type', 'urgent', 'data', 'datetime')


class DatasetSerializer(serializers.ModelSerializer):

    data = FileSerializer(many=True)

    class Meta:
        model = Dataset
        fields = ('id', 'dataset_name', 'description', 'data_type', 'data',
                  'datetime', 'preprocessing', 'znormalization', 'status', 'report_datetime')


class AugmentationResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = AugmentationResult
        fields = ('id', 'accuracy', 'precision', 'recall')


class AugmentedDatasetSerializer(serializers.ModelSerializer):

    data = FileSerializer(many=True)
    dataset = DatasetSerializer(many=False)
    augmentation_result = AugmentationResultSerializer(many=False)

    class Meta:
        model = AugmentedDataset
        fields = ('id', 'dataset_name', 'description', 'dataset', 'data_augmentation', 'status', 'data', 'datetime',
                  'report_datetime', 'augmentation_result', 'status')


class FNDatasetSerializer(serializers.ModelSerializer):

    data = FileSerializer(many=True)
    mvts_dataset = DatasetSerializer(many=False)
    aug_dataset = AugmentedDatasetSerializer(many=False)

    class Meta:
        model = FNDataset
        fields = ('id', 'dataset_name', 'description', 'mvts_dataset', 'aug_dataset', 'status', 'data', 'pearson', 'datetime', 'report_datetime',
                  'status', 'dataset_type')


class ProjectsResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectResult
        fields = ('id', 'accuracy', 'precision', 'recall')


class ProjectsInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectInfo
        fields = ('id', 'task', 'learning_type', 'ml_model',
                  'learning_rate', 'optimization', 'activation_func', 'layers', 'epochs', 'train_split')


class ProjectsSerializer(serializers.ModelSerializer):

    project_info = ProjectsInfoSerializer(many=False)
    project_result = ProjectsResultSerializer(many=False)
    data_info = DatasetSerializer(many=False)
    fn_data_info = FNDatasetSerializer(many=False)
    data_aug_info = AugmentedDatasetSerializer(many=False)

    class Meta:
        model = Project
        fields = ('id', 'user', 'project_name', 'description', 'status', 'datetime', 'report_datetime', 'data_info',
                  'fn_data_info', 'data_aug_info', 'project_info', 'project_result', 'dataset_type')


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ('id', 'user', 'type', 'name', 'email', 'country', 'phone')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password',)
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

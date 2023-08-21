
from rest_framework import status
from django.http import HttpResponse
from wsgiref.util import FileWrapper
from rest_framework.decorators import action
from .models import Project, ProjectInfo, UserInfo, ProjectResult, Dataset, File, Message, Feedback, BugFile, BugReport,\
    FNDataset, AugmentedDataset, AugmentationResult
from rest_framework import viewsets
from .serializers import ProjectsSerializer, ProjectsInfoSerializer, UserInfoSerializer, UserSerializer, DatasetSerializer, \
    ProjectsResultSerializer, FileSerializer, MessageSerializer, FeedbackSerializer, BugFileSerializer, BugReportSerializer, \
    AugmentedDatasetSerializer, FNDatasetSerializer, AugmentationResultSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .celeryTask import celeryTask
import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os
import environ
env = environ.Env()
environ.Env.read_env()

RECAPTCHA_SECRET = env("RECAPTCHA_SECRET")


@api_view(['POST'])
def recaptcha(request):
    r = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': RECAPTCHA_SECRET,
            'response': request.data['captcha_value'],
        }
    )

    return Response({'captcha': r.json()})


def sizify(value):

    # value = ing(value)
    if value < 512000:
        value = value / 1024.0
        ext = 'KB'
    elif value < 4194304000:
        value = value / 1048576.0
        ext = 'MB'
    else:
        value = value / 1073741824.0
        ext = 'GB'
    return '%s %s' % (str(round(value, 2)), ext)

# _______________________________________________________________________


class ProjectsViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectsSerializer
    queryset = Project.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_projects(self, request, pk=None):

        user = request.user
        projects = Project.objects.filter(user=user)

        serializer = ProjectsSerializer(projects, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def delete_project(self, request, pk=None):
        if 'project_id' in request.data:
            project_id = request.data['project_id']
            user = request.user

            project = Project.objects.get(user=user, id=project_id)

            project_info = ProjectInfo.objects.get(id=project.project_info.id)
            project_info.delete()

            if project.project_result:
                project_result = ProjectResult.objects.get(
                    id=project.project_result.id)
                project_result.delete()

            project.delete()
            projects = Project.objects.filter(user=user)
            serializer = ProjectsSerializer(projects, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def set_project(self, request, pk=None):

        if 'project_name' in request.data and 'task' in request.data \
                and 'learning_type' in request.data and 'ml_model' in request.data:

            project_name = request.data['project_name']
            task = request.data['task']
            learning_type = request.data['learning_type']
            ml_model = request.data['ml_model']

            dataset_type = request.data['dataset']

            learning_rate = None
            if request.data['learning_rate']:
                learning_rate = float(request.data['learning_rate'])

            optimization = None
            if request.data['optimization']:
                optimization = request.data['optimization']

            activation_func = None
            if request.data['activation_func']:
                activation_func = request.data['activation_func']

            layers = None
            if request.data['layers']:
                layers = int(request.data['layers'])

            epochs = None
            if request.data['epochs']:
                epochs = int(request.data['epochs'])

            train_split = None
            if request.data['train_split']:
                train_split = int(request.data['train_split'])

            description = None
            if request.data['description']:
                description = request.data['description']

            user = request.user

            project_info = ProjectInfo.objects.create(task=task, learning_type=learning_type, ml_model=ml_model,
                                                      learning_rate=learning_rate, optimization=optimization,
                                                      activation_func=activation_func, layers=layers, epochs=epochs,
                                                      train_split=train_split)

            project = None

            if dataset_type == 'dataset':
                data_info = Dataset.objects.get(
                    user=user, id=request.data['data_id'])
                project = Project.objects.create(user=user, project_name=project_name, description=description,
                                                 status='running',
                                                 project_info=project_info, data_info=data_info, dataset_type=dataset_type)
            elif dataset_type == 'fn_dataset':
                fn_data_info = FNDataset.objects.get(
                    user=user, id=request.data['data_id'])
                project = Project.objects.create(user=user, project_name=project_name, description=description,
                                                 status='running',
                                                 project_info=project_info, fn_data_info=fn_data_info, dataset_type=dataset_type)
            elif dataset_type == 'augmented_dataset':
                data_aug_info = AugmentedDataset.objects.get(
                    user=user, id=request.data['data_id'])
                project = Project.objects.create(user=user, project_name=project_name, description=description,
                                                 status='running',
                                                 project_info=project_info, data_aug_info=data_aug_info, dataset_type=dataset_type)

            id = project.id
            celeryTask.delay(id=id, type='ml')

            projects = Project.objects.filter(user=user)
            serializer = ProjectsSerializer(projects, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class ProjectsInfoViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectsInfoSerializer
    queryset = ProjectInfo.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['POST'])
    def get_info(self, request, pk=None):
        if 'projectinfo_id' in request.data:

            projectinfo_id = request.data['projectinfo_id']
            project_info = ProjectInfo.objects.get(id=projectinfo_id)

            serializer = ProjectsInfoSerializer(project_info, many=False)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure', 'data': ''}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    queryset = Dataset.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        datasets = Dataset.objects.filter(user=user)

        serializer = DatasetSerializer(datasets, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def delete_dataset(self, request, pk=None):
        if 'dataset_id' in request.data:
            dataset_id = request.data['dataset_id']
            user = request.user

            dataset = Dataset.objects.get(user=user, id=dataset_id)

            files = dataset.data.all()
            for file in files:
                myfile = File.objects.get(id=file.id)
                myfile.delete()

            dataset.delete()

            dataset = Dataset.objects.filter(user=user)
            serializer = DatasetSerializer(dataset, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'data_type' in request.data and 'dataset_name' in request.data:

            user = request.user
            dataset_name = request.data['dataset_name']
            data_type = request.data['data_type']
            preprocessing = 0
            znormalization = 0

            stat = 'completed'
            if request.data['preprocessing'] == 'false':
                preprocessing = int(0)
                stat = 'completed'
            elif request.data['preprocessing'] == 'true':
                preprocessing = int(1)
                stat = 'running'

            if request.data['znormalization'] == 'false':
                znormalization = int(0)

            elif request.data['znormalization'] == 'true':
                znormalization = int(1)

            description = None
            if request.data['description']:
                description = request.data['description']

            path = 'C:/Users/eskan/solarFlare/backend'

            train = File.objects.create(
                data=request.FILES['file0'], name=request.FILES['file0'].name)
            train.volume = sizify(os.path.getsize(path + train.data.url))
            train.save()
            label = File.objects.create(
                data=request.FILES['file1'], name=request.FILES['file1'].name)
            label.volume = sizify(os.path.getsize(path + label.data.url))
            label.save()

            dataset = Dataset.objects.create(user=user, dataset_name=dataset_name, description=description, data_type=data_type, preprocessing=preprocessing, status=stat,
                                             znormalization=znormalization,)

            dataset.data.add(train)
            dataset.data.add(label)
            dataset.save()

            if request.data['preprocessing'] == 'true':
                id = dataset.id
                celeryTask.delay(id=id, type='pp')

            datasets = Dataset.objects.filter(user=user)

            serializer = DatasetSerializer(datasets, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def get_file(self, request, pk=None):

        if 'dataset_id' in request.data:

            if request.data['type'] == 'PreProcessed':
                dataset = Dataset.objects.get(
                    id=request.data['dataset_id'])

                file_handle = dataset.data.all()[2].data

                document = open(file_handle.path, 'rb')
                response = HttpResponse(FileWrapper(
                    document), content_type='application/csv')
                response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                    2].name
                response['name'] = 'hi'
                return response
            else:

                if request.data['which'] == 'data':

                    dataset = Dataset.objects.get(
                        id=request.data['dataset_id'])

                    file_handle = dataset.data.all()[0].data
                    file_format = str(dataset.data.all()[
                        0].name).split('.')[1]

                    document = open(file_handle.path, 'rb')
                    response = HttpResponse(FileWrapper(
                        document), content_type='application/"%s"' % file_format)
                    response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                        0].name
                    return response
                else:
                    dataset = Dataset.objects.get(
                        id=request.data['dataset_id'])

                    file_handle = dataset.data.all()[1].data
                    file_format = str(dataset.data.all()[
                        1].name).split('.')[1]

                    document = open(file_handle.path, 'rb')
                    response = HttpResponse(FileWrapper(
                        document), content_type='application/"%s"' % file_format)
                    response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                        1].name
                    return response

        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class FNDatasetViewSet(viewsets.ModelViewSet):
    serializer_class = FNDatasetSerializer
    queryset = FNDataset.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        fndatasets = FNDataset.objects.filter(user=user)

        serializer = FNDatasetSerializer(fndatasets, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def delete_dataset(self, request, pk=None):
        if 'dataset_id' in request.data:
            dataset_id = request.data['dataset_id']
            user = request.user

            fndataset = FNDataset.objects.get(user=user, id=dataset_id)

            if fndataset.data.all():
                files = fndataset.data.all()
                for file in files:
                    myfile = File.objects.get(id=file.id)
                    myfile.delete()

            fndataset.delete()

            fndataset = FNDataset.objects.filter(user=user)
            serializer = FNDatasetSerializer(fndataset, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'dataset_name' in request.data and 'dataset_id' in request.data:

            user = request.user
            dataset_name = request.data['dataset_name']

            dataset_type = request.data['dataset']

            description = None
            if request.data['description']:
                description = request.data['description']

            pearson = None
            if request.data['pearson']:
                pearson = float(request.data['pearson'])

            fndataset = None

            if dataset_type == 'dataset':
                mvts_dataset = Dataset.objects.get(
                    user=user, id=request.data['dataset_id'])
                fndataset = FNDataset.objects.create(user=user, dataset_name=dataset_name, description=description,
                                                     mvts_dataset=mvts_dataset, status='running', dataset_type='dataset', pearson=pearson)

            elif dataset_type == 'augmented_dataset':
                aug_dataset = AugmentedDataset.objects.get(
                    user=user, id=request.data['dataset_id'])
                fndataset = FNDataset.objects.create(user=user, dataset_name=dataset_name, description=description,
                                                     aug_dataset=aug_dataset, status='running', dataset_type='augmented_dataset', pearson=pearson)

            id = fndataset.id
            celeryTask.delay(id=id, type='gg')

            fndatasets = FNDataset.objects.filter(user=user)

            serializer = FNDatasetSerializer(fndatasets, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def get_file(self, request, pk=None):

        if 'dataset_id' in request.data:

            if request.data['which'] == 'data':

                dataset = FNDataset.objects.get(
                    id=request.data['dataset_id'])

                file_handle = dataset.data.all()[0].data
                file_format = str(dataset.data.all()[
                    0].name).split('.')[1]

                document = open(file_handle.path, 'rb')
                response = HttpResponse(FileWrapper(
                    document), content_type='application/"%s"' % file_format)
                response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                    0].name
                return response
            else:
                dataset = FNDataset.objects.get(
                    id=request.data['dataset_id'])

                file_handle = dataset.data.all()[1].data
                file_format = str(dataset.data.all()[
                    1].name).split('.')[1]

                document = open(file_handle.path, 'rb')
                response = HttpResponse(FileWrapper(
                    document), content_type='application/"%s"' % file_format)
                response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                    1].name
                return response

        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class AugmentedDatasetViewSet(viewsets.ModelViewSet):
    serializer_class = AugmentedDatasetSerializer
    queryset = AugmentedDataset.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        datasets = AugmentedDataset.objects.filter(user=user)

        serializer = AugmentedDatasetSerializer(datasets, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def delete_dataset(self, request, pk=None):
        if 'dataset_id' in request.data:
            dataset_id = request.data['dataset_id']
            user = request.user

            dataset = AugmentedDataset.objects.get(user=user, id=dataset_id)

            if dataset.data.all():
                files = dataset.data.all()
                for file in files:
                    myfile = File.objects.get(id=file.id)
                    myfile.delete()

            if dataset.augmentation_result:
                augmentation_result = AugmentationResult.objects.get(
                    id=dataset.augmentation_result.id)
                augmentation_result.delete()

            dataset.delete()

            dataset = AugmentedDataset.objects.filter(user=user)
            serializer = AugmentedDatasetSerializer(dataset, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'dataset_name' in request.data and 'dataset_id' in request.data \
                and 'data_augmentation' in request.data:

            user = request.user
            dataset_name = request.data['dataset_name']
            dataset_id = request.data['dataset_id']
            dataset = Dataset.objects.get(user=user, id=dataset_id)
            data_augmentation = request.data['data_augmentation']

            description = None
            if request.data['description']:
                description = request.data['description']

            augmented_dataset = AugmentedDataset.objects.create(user=user, dataset_name=dataset_name, description=description,
                                                                dataset=dataset, data_augmentation=data_augmentation, status='running')

            id = augmented_dataset.id
            celeryTask.delay(id=id, type='da')

            datasets = AugmentedDataset.objects.filter(user=user)

            serializer = AugmentedDatasetSerializer(datasets, many=True)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def get_file(self, request, pk=None):

        if 'dataset_id' in request.data:

            if request.data['which'] == 'data':

                dataset = AugmentedDataset.objects.get(
                    id=request.data['dataset_id'])

                file_handle = dataset.data.all()[0].data
                file_format = str(dataset.data.all()[
                    0].name).split('.')[1]

                document = open(file_handle.path, 'rb')
                response = HttpResponse(FileWrapper(
                    document), content_type='application/"%s"' % file_format)
                response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                    0].name
                return response
            else:
                dataset = AugmentedDataset.objects.get(
                    id=request.data['dataset_id'])

                file_handle = dataset.data.all()[1].data
                file_format = str(dataset.data.all()[
                    1].name).split('.')[1]

                document = open(file_handle.path, 'rb')
                response = HttpResponse(FileWrapper(
                    document), content_type='application/"%s"' % file_format)
                response['Content-Disposition'] = 'attachment; filename="%s"' % dataset.data.all()[
                    1].name
                return response

        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class ProjectResultViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectsResultSerializer
    queryset = ProjectResult.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['POST'])
    def get_info(self, request, pk=None):
        if 'project_id' in request.data:
            user = request.user
            project_id = request.data['project_id']

            project = Project.objects.get(user=user, id=project_id)

            project_result = project.project_result
            serializer = ProjectsResultSerializer(project_result, many=False)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class AugmentationResultViewSet(viewsets.ModelViewSet):
    serializer_class = AugmentationResultSerializer
    queryset = AugmentationResult.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['POST'])
    def get_info(self, request, pk=None):
        if 'dataaug_id' in request.data:
            user = request.user
            dataaug_id = request.data['dataaug_id']

            data_aug = AugmentedDataset.objects.get(user=user, id=dataaug_id)

            data_aug_result = data_aug.augmentation_result
            serializer = AugmentationResultSerializer(
                data_aug_result, many=False)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class UserInfoViewSet(viewsets.ModelViewSet):
    serializer_class = UserInfoSerializer
    queryset = UserInfo.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        user_info = UserInfo.objects.get(user=user)

        serializer = UserInfoSerializer(user_info, many=False)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'type' in request.data and 'name' in request.data \
                and 'country' in request.data and 'phone' in request.data:

            user = request.user

            user_info = UserInfo.objects.get(user=user)

            if request.data['name']:
                name = request.data['name']
                user_info.name = name

            if request.data['type']:
                type = request.data['type']
                user_info.type = type

            if request.data['country']:
                country = request.data['country']
                user_info.country = country

            if request.data['phone']:
                phone = request.data['phone']
                user_info.phone = phone

            user_info.save()

            serializer = UserInfoSerializer(user_info, many=False)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


# _______________________________________________________________________

class BugReportViewSet(viewsets.ModelViewSet):
    serializer_class = BugReportSerializer
    queryset = BugReport.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        bug_report = BugReport.objects.filter(user=user)

        serializer = BugReportSerializer(bug_report, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'type' in request.data and 'urgent' in request.data and 'title' in request.data and 'description' in request.data:

            user = request.user
            type = request.data['type']
            if request.data['urgent'] == 'false':
                urgent = int(0)
            elif request.data['urgent'] == 'true':
                urgent = int(1)

            title = request.data['title']
            description = request.data['description']

            bug = BugFile.objects.create(data=request.FILES['file0'])

            BugReport.objects.create(
                user=user, type=type, urgent=urgent, title=title, description=description, data=bug)

            response = {'message': 'success'}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


# _______________________________________________________________________

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        messages = Message.objects.all()

        serializer = MessageSerializer(messages, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def get_info(self, request, pk=None):

        user = request.user
        feedbacks = Feedback.objects.filter(user=user)

        serializer = FeedbackSerializer(feedbacks, many=True)
        response = {'message': 'success', 'data': serializer.data}
        return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def set_info(self, request, pk=None):
        if 'title' in request.data and 'description' in request.data \
                and 'score' in request.data:

            user = request.user

            title = request.data['title']
            description = request.data['description']
            score = int(request.data['score'])

            Feedback.objects.create(
                user=user, title=title, description=description, score=score)

            response = {'message': 'success'}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

# _______________________________________________________________________


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['POST'])
    def set_user(self, request, pk=None):
        if 'username' in request.data and 'password' in request.data:

            username = request.data['username']
            password = request.data['password']

            name = None
            if request.data['name']:
                name = request.data['name']

            type = None
            if request.data['type']:
                type = request.data['type']

            country = None
            if request.data['country']:
                country = request.data['country']

            phone = ''

            user = User.objects.create(username=username, password=password)
            user.set_password(password)
            print(password)
            user.save()

            UserInfo.objects.create(
                user=user, email=username, phone=phone, name=name, type=type, country=country)

            serializer = UserSerializer(user, many=False)
            response = {'message': 'success', 'data': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {'message': 'failure'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'failure'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

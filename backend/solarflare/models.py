from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.


class Message(models.Model):
    TYPE = (
        ('update', 'Update'),
        ('issue', 'Issue'),
    )
    URGENT = (
        (1, 'Yes'),
        (0, 'No')
    )

    type = models.CharField(null=True, blank=True, max_length=32, choices=TYPE)
    title = models.CharField(null=True, blank=True, max_length=64)
    description = models.TextField(null=True, blank=True)
    urgent = models.IntegerField(null=True, blank=True, choices=URGENT)
    datetime = models.DateTimeField(auto_now_add=True)


class UserInfo(models.Model):
    TYPE = (
        ('personal', 'Personal'),
        ('organization', 'Organization'),
        ('school', 'School')
    )
    ACCESS = (
        (1, 'Yes'),
        (0, 'No')
    )
    COUNTRY = (
        ('unitedstates', 'United States'),
        ('canada', 'Canada')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(null=True, blank=True, max_length=32, choices=TYPE)
    name = models.CharField(null=True, blank=True, max_length=64)
    email = models.EmailField(null=False, max_length=64)
    phone = models.CharField(null=True, blank=True, max_length=16)
    country = models.CharField(
        null=True, blank=True, max_length=32, choices=COUNTRY)
    access = models.IntegerField(null=True, blank=True, choices=ACCESS)

    class Meta:
        unique_together = (('user', 'email'),)
        index_together = (('user', 'email'),)


class BugFile(models.Model):

    data = models.FileField(null=True, blank=True, upload_to='bugreport/')


class Feedback(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(null=True, blank=True, max_length=64)
    description = models.TextField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True, validators=(
        [MinValueValidator(1), MaxValueValidator(5)]))
    datetime = models.DateTimeField(auto_now_add=True)


class BugReport(models.Model):
    TYPE = (
        ('ui', 'User Interface'),
        ('server', 'Server'),
        ('security', 'Security'),
        ('programing', 'Programing'),
    )
    URGENT = (
        (1, 'Yes'),
        (0, 'No')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(null=True, blank=True, max_length=32, choices=TYPE)
    title = models.CharField(null=True, blank=True, max_length=64)
    description = models.TextField(null=True, blank=True)
    urgent = models.IntegerField(null=True, blank=True, choices=URGENT)
    data = models.ForeignKey(
        BugFile, null=True, blank=True, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)


class ProjectInfo(models.Model):
    TASK = (
        ('supervised', 'Supervised'),
        ('unsupervised', 'Unsupervised')
    )
    LEARNING_TYPE = (
        ('classification', 'Classification'),
        ('regression', 'Regression'),
        ('clustering', 'Clustering')
    )

    ML_MODEL = (
        ('rocket', 'ROCKET'),
        ('lstm', 'LSTM'),
        ('gru', 'GRU'),
        ('rnn', 'RNN'),
        ('sfc', 'Statistical Feature Computation'),
        ('le', 'Laplacian Eigenmaps'),
        ('node2vec', 'node2vec'),
        ('gcn', 'GCN'),
    )
    OPTIMIZATION = (
        ('gradientdescent', 'Gradient Descent'),
        ('adam', 'Adam Optimizer')
    )
    ACTIVATIONFUNC = (
        ('sigmoid', 'Sigmoid'),
        ('relu', 'ReLU'),
        ('tanh', 'Tanh')
    )

    task = models.CharField(null=False, max_length=32, choices=TASK)
    learning_type = models.CharField(
        null=False, max_length=32, choices=LEARNING_TYPE)
    ml_model = models.CharField(null=False, max_length=32, choices=ML_MODEL)

    learning_rate = models.FloatField(null=True, blank=True, validators=(
        [MinValueValidator(0.0), MaxValueValidator(1.0)]))
    optimization = models.CharField(
        null=True, blank=True, max_length=32, choices=OPTIMIZATION)
    activation_func = models.CharField(
        null=True, blank=True, max_length=32, choices=ACTIVATIONFUNC)
    layers = models.IntegerField(null=True, blank=True, validators=(
        [MinValueValidator(1), MaxValueValidator(20)]))
    epochs = models.IntegerField(null=True, blank=True, validators=(
        [MinValueValidator(1), MaxValueValidator(20)]))
    train_split = models.IntegerField(null=True, blank=True, validators=(
        [MinValueValidator(50), MaxValueValidator(90)]))


class ProjectResult(models.Model):

    accuracy = models.FloatField(null=True, blank=True,
                                 validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))
    precision = models.FloatField(null=True, blank=True,
                                  validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))
    recall = models.FloatField(null=True, blank=True,
                               validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))


class AugmentationResult(models.Model):

    accuracy = models.FloatField(null=True, blank=True,
                                 validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))
    precision = models.FloatField(null=True, blank=True,
                                  validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))
    recall = models.FloatField(null=True, blank=True,
                               validators=([MinValueValidator(0.0), MaxValueValidator(1.0)]))


class File(models.Model):

    data = models.FileField(null=True, blank=True, upload_to='datasets/')
    name = models.CharField(null=True, blank=True, max_length=64)
    volume = models.CharField(null=True, blank=True, max_length=64)


class Dataset(models.Model):

    DATA_TYPE = (
        ('mvts', 'MVTS'),
        ('fn', 'Functional Network')
    )
    PREPROCESSING = (
        (1, 'Yes'),
        (0, 'No')
    )
    ZNORMALIZATION = (
        (1, 'Yes'),
        (0, 'No')
    )
    STATUS = (
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset_name = models.CharField(null=False, max_length=64)
    description = models.TextField(null=True, blank=True)
    data_type = models.CharField(null=False, max_length=32, choices=DATA_TYPE)
    data = models.ManyToManyField(File)
    status = models.CharField(null=False, blank=True,
                              max_length=32, choices=STATUS)
    preprocessing = models.IntegerField(
        null=True, blank=True, choices=PREPROCESSING)
    znormalization = models.IntegerField(
        null=True, blank=True, choices=ZNORMALIZATION)
    datetime = models.DateTimeField(auto_now_add=True)
    report_datetime = models.DateTimeField(auto_now=True)


class AugmentedDataset(models.Model):

    STATUS = (
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )
    DATAAUGMENTATION = (
        ('smote', 'SMOTE'),
        ('timegan', 'TimeGan'),
        ('gni', 'Gaussian Noise Injection'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset_name = models.CharField(null=False, max_length=64)
    description = models.TextField(null=True, blank=True)
    dataset = models.ForeignKey(
        Dataset, null=True, blank=True, on_delete=models.SET_NULL)
    data_augmentation = models.CharField(
        null=True, blank=True, max_length=32, choices=DATAAUGMENTATION)
    status = models.CharField(null=False, max_length=32, choices=STATUS)
    data = models.ManyToManyField(File)
    datetime = models.DateTimeField(auto_now_add=True)
    report_datetime = models.DateTimeField(auto_now=True)
    augmentation_result = models.ForeignKey(
        AugmentationResult, null=True, blank=True, on_delete=models.CASCADE)


class FNDataset(models.Model):

    STATUS = (
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset_name = models.CharField(null=False, max_length=64)
    description = models.TextField(null=True, blank=True)
    dataset_type = models.CharField(null=True, blank=True, max_length=32)
    mvts_dataset = models.ForeignKey(
        Dataset, null=True, blank=True, on_delete=models.SET_NULL)
    aug_dataset = models.ForeignKey(
        AugmentedDataset, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(null=False, max_length=32, choices=STATUS)
    data = models.ManyToManyField(File)
    pearson = models.FloatField(null=True, blank=True, validators=(
        [MinValueValidator(-1.0), MaxValueValidator(1.0)]))
    datetime = models.DateTimeField(auto_now_add=True)
    report_datetime = models.DateTimeField(auto_now=True)


class Project(models.Model):
    STATUS = (
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(null=False, max_length=64)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(null=False, max_length=32, choices=STATUS)
    datetime = models.DateTimeField(auto_now_add=True)
    report_datetime = models.DateTimeField(auto_now=True)
    dataset_type = models.CharField(null=True, blank=True, max_length=32)
    data_info = models.ForeignKey(
        Dataset, null=True, blank=True, on_delete=models.SET_NULL)
    fn_data_info = models.ForeignKey(
        FNDataset, null=True, blank=True, on_delete=models.SET_NULL)
    data_aug_info = models.ForeignKey(
        AugmentedDataset, null=True, blank=True, on_delete=models.SET_NULL)
    project_info = models.ForeignKey(
        ProjectInfo, null=True, blank=True, on_delete=models.CASCADE)
    project_result = models.ForeignKey(
        ProjectResult, null=True, blank=True, on_delete=models.CASCADE)

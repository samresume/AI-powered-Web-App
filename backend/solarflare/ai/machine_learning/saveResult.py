from solarflare.models import Project, ProjectResult
import random

def save(id):
    id = id

    random.seed(a=None, version=2)

    accuracy = round(random.uniform(0.00, 1.00), 2)
    precision = round(random.uniform(0.00, 1.00), 2)
    recall = round(random.uniform(0.00, 1.00), 2)

    project_result = ProjectResult.objects.create(accuracy=accuracy, precision=precision, recall=recall)

    project = Project.objects.get(id=id)
    project.project_result = project_result
    project.status = 'completed'
    project.save()
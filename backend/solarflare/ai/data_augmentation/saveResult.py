from solarflare.models import AugmentedDataset, File, AugmentationResult
import os
from datetime import datetime
import random

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


def save(id):
    id = id

    globalPath = 'C:/Users/eskan/solarFlare/backend'

    path = 'datasets/'

    now = datetime.now().strftime("%Y%M%D%H%M%S").replace('/', '')

    with open(path + 'train_augmented_' + now + '.csv', 'w') as tp:
        pass

    with open(path + 'label_augmented_' + now + '.csv', 'w') as lp:
        pass

    train_augmented = ''
    label_augmented = ''

    with open(path + 'train_augmented_' + now + '.csv', 'r') as tp:
        train_augmented = File.objects.create(data=path + 'train_augmented_' + now + '.csv',
                                          name='train_augmented_' + now + '.csv')
        train_augmented.volume = sizify(os.path.getsize(globalPath + train_augmented.data.url))
        train_augmented.save()

    with open(path + 'label_augmented_' + now + '.csv', 'r') as lp:
        label_augmented = File.objects.create(data=path + 'label_augmented_' + now + '.csv',
                                          name='label_augmented_' + now + '.csv')
        label_augmented.volume = sizify(os.path.getsize(globalPath + label_augmented.data.url))
        label_augmented.save()

    random.seed(a=None, version=2)

    accuracy = round(random.uniform(0.00, 1.00), 2)
    precision = round(random.uniform(0.00, 1.00), 2)
    recall = round(random.uniform(0.00, 1.00), 2)

    augmentation_result = AugmentationResult.objects.create(accuracy=accuracy, precision=precision, recall=recall)

    dataset = AugmentedDataset.objects.get(id=id)
    dataset.augmentation_result = augmentation_result
    dataset.status = 'completed'
    dataset.save()

    dataset.data.add(train_augmented)
    dataset.data.add(label_augmented)
    dataset.save()

from solarflare.models import Dataset, File
import os
from datetime import datetime


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

    with open(path + 'train_preprocessed_' + now + '.csv', 'w') as tp:
        pass

    train_preprocessed = ''

    with open(path + 'train_preprocessed_' + now + '.csv', 'r') as tp:
        train_preprocessed = File.objects.create(
            data=path + 'train_preprocessed_' + now + '.csv', name='train_preprocessed_' + now + '.csv')
        train_preprocessed.volume = sizify(os.path.getsize(
            globalPath + train_preprocessed.data.url))
        train_preprocessed.save()

    dataset = Dataset.objects.get(id=id)
    dataset.status = 'completed'
    dataset.save()

    dataset.data.add(train_preprocessed)
    dataset.save()

from django.http import HttpResponse
from django.shortcuts import render, redirect
from .check_new_urls import check_new_urls

# Create your views here.
# directory for old okko templates: 'main_app/templates/old/'
# directory for new don templates: 'main_app/templates/new/'
def index(request):
    if request.method == 'GET':
        new_templates = check_new_urls('main_app/templates/new')
        old_templates = check_new_urls('main_app/templates/old')
        templates = (zip_unequal(old_templates, new_templates))
        return render(request, 'main-app-base.html', {'templates': templates})

def template(request, **kwargs):
    if kwargs['type'] == 'old':
        template_url = kwargs['type'] + '/' + kwargs['template_name']
    elif kwargs['type'] == 'new':
        template_url = kwargs['type'] + '/' + kwargs['template_name']
    return render(request, template_url, {
        'transaction': {
            'fingerprint': {
                'client_email': 'test@test.ru',
            },
            'public_id': '4e8rwdhf8hqoihdfdas',
            'invoice_amount': 10.5,
            'currency': 'RUB',
            'pan_mask': '541715******2399',
            'cancel_url': '../',
        },
        'merchant': {
        },
    })


def zip_unequal(list1, list2):
    '''Zips unequal lists
    Output: (1,"b"), (2,"c"), (3, )
    '''
    c = []
    if len(list1)>len(list2):
        for x in range(len(list1)):
            if x < len(list2):
                c.append((list1[x],list2[x]))
            else:
                c.append((list1[x], ' '))
    else:
        for x in range(len(list2)):
            if x < len(list1):
                c.append((list2[x],list1[x]))
            else:
                c.append((list2[x], ' '))
    return c

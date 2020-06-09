from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, reverse
from django.utils import timezone

from .models import Twitt

def index(request):
    #print(request.user.is_authenticated)
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/login")
    latest_twitt_list = Twitt.objects.order_by('-pub_date')[:5]
    context = {
        'latest_twitt_list': latest_twitt_list,
    }
    return render(request, 'twitts/index.html', context)

def detail(request, twitt_id):
    twitt = get_object_or_404(Twitt, pk=twitt_id)
    return render(request, 'twitts/details.html', {'twitt': twitt})

def new(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/login")
    return render(request, 'twitts/new.html')
    
def author(request, author):
	twitts = Twitt.objects.filter(author=author)
	return render(request, 'twitts/author.html', {'twitts':twitts, 'author':author})
    
def create(request):
    print(request.POST)
    text = request.POST['text']
    important = False
    if "important" in request.POST and request.POST['important'] == "on":
      important = True
    if text == "":
        return render(request, 'twitts/new.html', {
            'error_message': "Twitt text is empty.",
        })   
    else:
        #selected_choice.votes += 1
        newTwitt = Twitt.objects.create(twitt_text=text, pub_date=timezone.now(), \
            author=request.user.username, important=important)
        #selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('twitts:index'))

from django.db import models


class Twitt(models.Model):
    def __str__(self):
        return self.twitt_text
    twitt_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    author = models.CharField(max_length=200)
    important = models.BooleanField(default=False)


#class Choice(models.Model):
#    question = models.ForeignKey(Question, on_delete=models.CASCADE)
#    choice_text = models.CharField(max_length=200)
#    votes = models.IntegerField(default=0)

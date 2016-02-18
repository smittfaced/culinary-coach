from google.appengine.api import images

__author__ = 'Andrew'

from google.appengine.ext import ndb
from google.appengine.ext import blobstore
from google.appengine.api import images
from google.appengine.api import users
from google.appengine.ext.webapp import blobstore_handlers


class Direction(ndb.Model):
    instruction = ndb.StringProperty(required=True)


class Ingredient(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    amount = ndb.FloatProperty(required=True)
    unit = ndb.StringProperty(required=True)
    note = ndb.StringProperty(default='', required=True)


class Utility(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    function = ndb.StringProperty(required=True)
    link = ndb.StringProperty(default='http://www.webstaurantstore.com/')


class Recipe(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    category = ndb.StringProperty(repeated=True, indexed=True)
    description = ndb.TextProperty(required=True)
    prep_time = ndb.FloatProperty(required=True)
    cook_time = ndb.FloatProperty(required=True)
    serves = ndb.IntegerProperty(required=True)
    img = ndb.BlobKeyProperty(repeated=True)
    avatar = ndb.BlobKeyProperty(repeated=False)
    directions = ndb.StructuredProperty(Direction, repeated=True)
    ingredients = ndb.StructuredProperty(Ingredient, repeated=True, indexed=True)
    utilities = ndb.StructuredProperty(Utility, repeated=True)
    urlID = ndb.StringProperty()


class RecipeBrief(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    urlID = ndb.StringProperty(required=True)


class RecipeNote(ndb.Model):
    # Notes
    note = ndb.StringProperty()
    # RecipeID
    urlID = ndb.StringProperty(required=True, indexed=True)


class Phone(ndb.Model):
    type = ndb.StringProperty(required=True)
    number = ndb.StringProperty(required=True, default='')


class Address(ndb.Model):
    type = ndb.StringProperty(required=True, default='home')
    street = ndb.StringProperty(required=True)
    street2 = ndb.StringProperty(default='')
    city = ndb.StringProperty(required=True)
    state = ndb.StringProperty(required=True)
    zip = ndb.IntegerProperty(required=True)


class Student(ndb.Model):
    userID = ndb.StringProperty(required=True)
    urlID = ndb.StringProperty()
    avatar = ndb.BlobKeyProperty(repeated=False)
    date = ndb.DateTimeProperty(auto_now_add=True)
    nickname = ndb.StringProperty(indexed=True)
    firstname = ndb.StringProperty(required=True, indexed=True)
    lastname = ndb.StringProperty(required=True, indexed=True)
    email = ndb.StringProperty(required=True)
    phone = ndb.StructuredProperty(Phone, repeated=True)
    address = ndb.StructuredProperty(Address, repeated=True)
    recipes = ndb.StructuredProperty(RecipeBrief, repeated=True)
    favRecipes = ndb.StringProperty(repeated=True)
    recipeNotes = ndb.StructuredProperty(RecipeNote, repeated=True)
    theme = ndb.StringProperty(repeated=False, default='light')


class StockImage(ndb.Model):
    name = ndb.StringProperty(required=True)
    image = ndb.BlobKeyProperty(repeated=False, required=True)

# Returns Student record from Datastore
def getStudent(user):
    try:
        return Student.query(Student.userID == user.user_id()).fetch(1)[0]
    except:
        return ""


# Returns the Login Status of the User
def getLoginStatus(user):
    if user:
        return users.create_logout_url('/')
    else:
        return users.create_login_url('/profile')


# Returns the Profile Status of the User
def getProfileStatus(user):
    if user:
        return True
    else:
        return False


# Returns Blobstore Image URLs with Optional Style
def getServingURL(blobkey, size, shape):
    # Get URL
    url = images.get_serving_url(blobkey)

    # Add Style
    extra = '='
    if (size != ''):
        extra += ('-s' + str(size))
    if (shape):
        extra += '-cc'

    if (extra != '='):
        url += extra

    # Return URL
    return url


# Returns Blobstore Image URLs For Download
class ImageDownloadHandler(blobstore_handlers.BlobstoreDownloadHandler):

    def get(self, key):
        if not blobstore.get(key):
            self.error(404)
        else:
            self.send_blob(key)

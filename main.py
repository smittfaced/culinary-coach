# WEB Imports
import webapp2

# GAE Imports

# Other .py File Imports
from pythons import admin
from pythons import base
from pythons import recipe
from pythons import student

# Page Interpreter
app = webapp2.WSGIApplication([

    # Admin Handlers
    ('/admin', admin.AdminHandler),
    ('/stock_image_upload', admin.StockImageUploader),

    # Student Handlers
    ('/profile', student.StudentServeHandler),
    ('/new_profile', student.NewProfileHandler),
    ('/serve_student', student.StudentServeHandler),
    ('/update_student', student.StudentPermissionUpdateHandler),
    ('/update_fav_recipes', student.UpdateFavoriteRecipesHandler),
    ('/update_fav_recipe', student.UpdateFavoriteRecipeHandler),
    ('/update_nickname', student.UpdateNicknameHandler),
    ('/update_phone', student.UpdatePhoneHandler),
    ('/update_address', student.UpdateAddressHandler),
    ('/update_avatar', student.UpdateAvatarHandler),
    ('/update_recipe_notes', student.UpdateRecipeNotesHandler),
    ('/blob_upload_url', student.BlobUploadURLServeHandler),

    # Recipe Handlers
    ('/recipe_upload', recipe.RecipeUploadHandler),
    ('/recipe_update', recipe.RecipeUpdateHandler),
    ('/serve_recipe', recipe.RecipeServeHandler),
    ('/recipe', recipe.ShowRecipeHandler),

    # Other Handlers
    ('/gallery', recipe.GalleryImageHandler),
    ('/contact', admin.ContactHandler),
    ('/', base.LandingHandler)

], debug=True)

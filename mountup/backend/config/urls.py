from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def root_status(_request):
    return JsonResponse(
        {
            "message": "MountUp backend is running.",
            "api_base": "/api/",
            "admin": "/admin/",
        }
    )

urlpatterns = [
    path('', root_status),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
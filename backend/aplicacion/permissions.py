DEFAULT_PERMS = {
    "can_view": False,
    "can_add": False,
    "can_change": False,
    "can_delete": False,
}

FULL_ACCESS = {
    "can_view": True,
    "can_add": True,
    "can_change": True,
    "can_delete": True,
}


def permissions_for_model(user, model):
    if not user or not user.is_authenticated:
        return DEFAULT_PERMS.copy()
    if getattr(user, "is_superuser", False):
        return FULL_ACCESS.copy()

    app_label = model._meta.app_label
    model_name = model._meta.model_name
    return {
        "can_view": user.has_perm(f"{app_label}.view_{model_name}"),
        "can_add": user.has_perm(f"{app_label}.add_{model_name}"),
        "can_change": user.has_perm(f"{app_label}.change_{model_name}"),
        "can_delete": user.has_perm(f"{app_label}.delete_{model_name}"),
    }


def role_for_user(user):
    if not user or not user.is_authenticated:
        return {"role": "none", "is_admin": False, "is_user": False}
    is_admin = user.groups.filter(name="Admin").exists()
    is_user = user.groups.filter(name="User").exists()
    role = "admin" if is_admin else "user" if is_user else "none"
    return {"role": role, "is_admin": is_admin, "is_user": is_user}

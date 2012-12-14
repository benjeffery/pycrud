class Object(object):
    def __init__(self, contents):
        self.contents = contents
    def html(self, model):
        out = ""
        for key, val in self.contents.items():
            recurse = val.html('{model}.{key}'.format(**locals()))
            out += """
            <div class="sub-object" ng-class="{{error: form_{model}.$invalid}}">
                <label>{key}:</label>
                {recurse}
            </div>""".format(**locals())
        return out
class Text(object):
    def html(self, model):
        name = model.split('.')[-1]
        return """<input type="text" name="{name}" ng-model="{model}">""".format(**locals())

class Markdown(object):
    def html(self, model):
        name = model.split('.')[-1]
        return """<input type="text" name="{name}" ng-model="{model}">""".format(**locals())

class List(object):
    def __init__(self, contents):
        self.contents = contents
    def html(self, model):
        name = model.split('.')[-1]
        recurse = self.contents.html('element')
        if type(self.contents) == Object:
            style = "list-element-simple"
        else:
            style = "list-element"
        return """
            <div class="list">
                <div class="{style}" ng-repeat="element in {model}">
                    <button class="list-btn-remove" ng-click="remove({model},element)"><i class="icon-remove icon-white"></i></button>
                    <ng-form name="form_element">
                        {recurse}
                    </ng-form>
                </div>
                <button class="list-btn-add" ng-click=""><i class="icon-plus icon-white"></i></button>
            </div>
    """.format(**locals())

class Boolean(object):
    def html(self, model):
        name = model.split('.')[-1]
        return """<input type="checkbox"
                   ng-model="{model}"
                   name="{name}"
                   >""".format(**locals())

class MongoLink(object):
    def __init__(self, contents):
        self.contents = contents

    def html(self, model):
            return """OBJ
        """

class Email(object):
    def html(self, model):
        return """OBJ
    """

class URL(object):
    def html(self, model):
        return """OBJ
    """

class Location(object):
    def html(self, model):
        return """OBJ
    """

class Image(object):
    def html(self, model):
        return """OBJ
    """
    
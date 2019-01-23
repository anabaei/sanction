

# Run app

* git clone
* check have two db as 
```
aml
aml_dev_pro
```
* yarn start
* open page 
```java
/start
``` 
*Then click on 
```java
Create
info0
info1
info1
```


# Run Sanctions 

```java
at ... /lib/python3.7/site-packages/memorious-0.7.20-py3.7.egg/memorious/settings.py
//change to
DATASTORE_URI = env('DATASTORE_URI', 'mysql+pymysql://root:password@localhost/aml')

 python setup.py --help-commands
 python setup.py build
 python setup.py install
 memorious list
 memorious run crawl_name
 // Done!

Notice: to run any python command, you need to used the following:
example: python3.6 setup.py build
or: pip3.6 
 
If error happen as The 'pyicu>=1.9.3' distribution was not found and is required by normality
 then follow some server installations
```

# Server Installation
```java
 //check pip version
 pip -V
 // upgrade if needed 
 pip install --upgrade pip
 // install sometools
 pip install -U setuptools
 // to install mysql if not exist
 yum install mysql
 yum install mariadb-server
 // to start mysql
 systemctl start mariadb  

```
This [link](https://linuxize.com/post/how-to-install-python-3-on-centos-7/) useful for installation python




files = $(shell ls *_template.html | sed s/_template//)

html : $(files)

%.html : %_template.html %.py
	python3 insert_figure.py $< $@

FFT_spec.py FFT_window.py FFT_resol.py : FFT_demo.py

clean :
	rm $(files)
	rm *~

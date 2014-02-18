TESTS = test/*.js
BIN = node_modules/.bin
test:
	@${BIN}/mocha --reporter ${reporter} \
	    ${opts} \
        $(TESTS)
.PHONY: test
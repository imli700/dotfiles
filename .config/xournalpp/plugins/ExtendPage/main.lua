-- Register the plugin functions in Xournal++
function initUi()
	app.registerUi({
		["menu"] = "Extend Page Height",
		["callback"] = "extendHeight",
		["accelerator"] = "<Control><Alt>Down",
	})

	app.registerUi({
		["menu"] = "Extend Page Width",
		["callback"] = "extendWidth",
		["accelerator"] = "<Control><Alt>Right",
	})
end

function extendHeight()
	app.setPageSize(0, 850, true)
end

function extendWidth()
	app.setPageSize(850, 0, true)
end

<?php
class WPCF7_TagGenerator
{

	public static function get_instance()
	{
		return new self();
	}

	public function add($id, $title, $callback, $options = array()) {}
}
